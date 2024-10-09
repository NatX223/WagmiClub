const express = require("express");
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { CovalentClient } = require("@covalenthq/client-sdk");

// Import Moralis
const Moralis = require("moralis").default;

// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils");

// Import dotenv to use environment variables
require('dotenv').config();

// initializing firebase
const admin = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require("./wagmi-club-firebase-adminsdk-cde6r-4f3cc52568.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'wagmi-club.appspot.com'
});

const bucket = getStorage().bucket();
const storage = multer.memoryStorage();

const db = getFirestore();

const app = express();
const port = process.env.PORT || 3300;

// Enable CORS for any origin
app.use(cors({
  origin: '*', // Allow requests from any origin
  credentials: true, // Include if you're using credentials (e.g., cookies, authorization headers)
}));

app.use(express.json());

const moralisApiKey = process.env.MORALIS_API;
const covalentApiKey = process.env.COVALENT_API;

const privateKey = process.env.privateKey;

// Add this a startServer function that initialises Moralis
const startServer = async () => {
    await Moralis.start({
      apiKey: moralisApiKey,
    });
  
    app.listen(port, "0.0.0.0", () => {
      console.log(`Example app listening on port ${port}`);
    });
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
}).single('file');

app.post("/uploadImage", async (req, res) => {
  let fileURL;
  upload(req, res, async (err) => {
    if (err) {
      console.error('error uploading file:', err);
      res.status(500).json({ error: err.message });
    } else {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
      } else {
        try {
          const file = req.file;
          const fileName = file.originalname;

          const fileUpload = bucket.file(fileName);

          const fileStream = fileUpload.createWriteStream({
            metadata: {
              contentType: file.mimetype
            }
          });

          fileStream.on('error', (error) => {
            console.error('Error uploading to Firebase:', error);
            res.status(500).json({ error: 'Error uploading to Firebase' });
          });

          fileStream.on('finish', () => {
            fileURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;
            console.log('File uploaded to Firebase. Download URL:', fileURL);
            res.status(200).json({ response: 'File uploaded successfully', url: fileURL });
          });

          fileStream.end(file.buffer);
        } catch (error) {
          console.error('Error uploading file:', error);
          res.status(500).json({ error: 'Error uploading file' });
        }
      }
    }
  });
});

app.get("/getEligible/:tokenId", async (req, res) => {
    // get the chain and contractAddress from the requset/query
    const tokenId = req.params.tokenId;
    //get the needed params - useraddress, chain, nftname/contract address, requirement
    const medalRef = await db.collection('medals').doc(tokenId).get();
    const medalDoc = medalRef.data();
    const contractAddress = medalDoc.contractAddress;
    const chain = medalDoc.chain;
    const type = medalDoc.type;
    const requirement = medalDoc.requirement; 
    let indecies = [];
    let questers = [];

    try {
      // get all questers
      const questersRef = db.collection('medals').doc(tokenId).collection('questers');
      const questerssnapshot = await questersRef.get();
      questerssnapshot.forEach(doc => {
        const userObj = {address: doc.data().address, index: doc.data().index, id: doc.id}
        if (doc.data().claimed == false) {
          questers.push(userObj);
        }
      });
      console.log('questers', questers);
      // loop through all questers and check if the are eligible
      for (let i = 0; i < questers.length; i++) {
        const address = questers[i].address;
        var userAmount;

          if (type == 0) {
            userAmount = await getCollectionAmount(address, chain, contractAddress);
            if (userAmount >= requirement) {
              indecies.push(questers[i].index);
            }
          } else {
            userAmount = await getTransactionAmount(address, chain, contractAddress);
            if (userAmount >= requirement) {
              indecies.push(questers[i].index);
            }
          }
      }
      const _index = Math.min(...indecies);
      console.log('index', _index);
      const foundObject = questers.find(item => item.index === _index);
      const id = foundObject.id;
      const userAddress = foundObject.address;
      const qref = questersRef.doc(id);
      await qref.update({claimed: true});
      await db.collection('medals').doc(tokenId).update({ minters: FieldValue.arrayUnion(userAddress) })
      const response = { index: _index };
      res.status(200).json(response);
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500);
      res.json({ error: error.message });
    }
});

app.get("/getEligibleArray/:tokenId", async (req, res) => {
  // get the chain and contractAddress from the requset/query
  const tokenId = req.params.tokenId;
  //get the needed params - useraddress, chain, nftname/contract address, requirement
  const medalRef = await db.collection('medals').doc(tokenId).get();
  const medalDoc = medalRef.data();
  const contractAddress = medalDoc.contractAddress;
  const chain = medalDoc.chain;
  const type = medalDoc.type;
  const requirement = medalDoc.requirement; 
  let indecies = [];
  let questers = [];
  let eligible = [];

  try {
    // get all questers
    const questersRef = db.collection('medals').doc(tokenId).collection('questers');
    const questerssnapshot = await questersRef.get();
    if (questerssnapshot.empty) {
      const response = { eligible: eligible };
      res.status(200).json(response);
    }

    questerssnapshot.forEach(doc => {
      const userObj = {address: doc.data().address, index: doc.data().index, id: doc.id}
      if (doc.data().claimed == false) {
        questers.push(userObj);
      }
    });
    console.log('questers', questers);
    // loop through all questers and check if the are eligible
    for (let i = 0; i < questers.length; i++) {
      const address = questers[i].address;
      var userAmount;

        if (type == 0) {
          userAmount = await getCollectionAmount(address, chain, contractAddress);
          if (userAmount >= requirement) {
            indecies.push(questers[i].index);
          }
        } else {
          userAmount = await getTransactionAmount(address, chain, contractAddress);
          if (userAmount >= requirement) {
            indecies.push(questers[i].index);
          }
        }
    }

    for (let i = 0; i < indecies.length; i++) {
      const _index = indecies[i];
      console.log('index', _index);
      const foundObject = questers.find(item => item.index === _index);
      const id = foundObject.id;
      const userAddress = foundObject.address;
      const qref = questersRef.doc(id);
      const qDoc = await qref.get();
      const address = qDoc.data().address;
      eligible.push(address);
      await qref.update({claimed: true});
      await db.collection('medals').doc(tokenId).update({ minters: FieldValue.arrayUnion(userAddress) })
    }
    const response = { eligible: eligible };
    res.status(200).json(response);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500);
    res.json({ error: error.message });
  }
});

// function to get the amount of NFTs of a collection an account has
const getCollectionAmount = async (address, _chain, nftAddress) => {
  if (_chain == "Viction") {
    try {
      const result = victionNftCheck(address);

      const amount = AmountByAddress(result, nftAddress);
      console.log(amount);
      return amount;
    
      } catch (error) {
          console.error(error);
          return error;
      }
  } else {
    var chain;
    switch (_chain) {
        case "Lukso":
            chain = EvmChain.MUMBAI;
            break;
        case "Eth Sepolia":
            chain = EvmChain.SEPOLIA;
            break;
        case "Polygon Mumbai":
            chain = EvmChain.MUMBAI;
            break;
        case "BSC Testnet":
            chain = EvmChain.BSC_TESTNET;
            break;
        default:
            chain = EvmChain.MUMBAI;
    }
  
    // check moralis API on how to get the name of an NFT collection fromt the contract address
    try {
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain
    });
  
    const amount = sumAmountByAddress(response.raw.result, nftAddress);
    console.log(amount);
    return amount;
  
    } catch (error) {
        console.error(error);
        return error;
    }
  }
  // const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
}

const sumAmountByAddress = (data, address) => {
  // Filter the array to include only objects with the specified 'name'
  console.log('data', data);
  const add = Number(address);
  const filteredData = data.filter((item) => item.token_address == add);
  console.log('address', add);
  console.log('filtered data', filteredData);

  // Sum the 'amount' values in the filtered array
  const sum = filteredData.reduce((total, item) => total + Number(item.amount), 0);

  console.log('sum', sum);
  return sum;
}

const AmountByAddress = (data, address) => {
  // Filter the array to include only objects with the specified 'name'
  console.log('data', data);
  const add = Number(address);
  const filteredData = data.filter((item) => item.contract_address == add);
  console.log('address', add);
  console.log('filtered data', filteredData);

  // Sum the 'amount' values in the filtered array
  const sum = filteredData.reduce((total, item) => total + Number(item.balance), 0);

  console.log('sum', sum);
  return sum;
}

app.get("/addBadge", async (req, res) => {
  try {
    const address = req.query.userAddress;
    const users = db.collection('users');
    const userSnapshot = await users.where('address', '==', address).get();
    if (userSnapshot.empty) {
      const jsonResponse = { response: "user does not exist" }
      res.status(200);
      res.json(jsonResponse);
    }

    else {
      const userDoc = userSnapshot.docs[0];
      const currentBadgeCount = userDoc.data().badges;
      const newBadgeCount = currentBadgeCount + 1;

      await db.collection('users').doc(userDoc.id).update({badges: newBadgeCount});
      console.log(userDoc.id, newBadgeCount);
      const jsonResponse = { status: "successful" };
      res.json(jsonResponse);
      res.status(200);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: error.message });
  }

})

app.get("/addMedal", async (req, res) => {
  try {
    const address = req.query.userAddress;
    const users = db.collection('users');
    const userSnapshot = await users.where('address', '==', address).get();
    if (userSnapshot.empty) {
      const jsonResponse = { response: "user does not exist" }
      res.status(200);
      res.json(jsonResponse);
    }
    else {
      const userDoc = userSnapshot.docs[0];
      const currentMedalCount = userDoc.data().medals;
      const newMedalCount = currentMedalCount + 1;

      await db.collection('users').doc(userDoc.id).update({medals: newMedalCount});
      console.log(userDoc.id, newMedalCount);
      const jsonResponse = { status: "successful" };
      res.json(jsonResponse);
      res.status(200);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: error.message });
  }

})

app.get("/getBoard", async (req, res) => {
  try {
    const profession = req.query.profession;
    const type = req.query.type;

    const leaderBoardRef = db.collection('users');
    // filter the users by the type and profession
    const leaderBoardSnapshot = await leaderBoardRef.where('profession', '==', profession).orderBy('medals', 'desc').get();
    if (leaderBoardSnapshot.empty) {
      const jsonResponse = { response: "No users available" }
      res.status(200);
      res.json(jsonResponse);
    } else if(type == 'medals') {
      const _leaderBoard = leaderBoardSnapshot.docs;
      console.log(_leaderBoard);
      const leaderBoard_ = _leaderBoard.map(item => ({
        username: item.data().username,
        imageURL: item.data().imageURL,
        score: item.data().medals
      }));

      const leaderBoard = JSON.stringify(leaderBoard_);
      res.status(200);
      res.json(leaderBoard);
      console.log(leaderBoard);
    }
    else {
      const _leaderBoard = leaderBoardSnapshot.docs;
      console.log(_leaderBoard);
      const leaderBoard_ = _leaderBoard.map(item => ({
        username: item.data().username,
        imageURL: item.data().imageURL,
        score: item.data().badges
      }));

      const leaderBoard = JSON.stringify(leaderBoard_);
      res.status(200);
      res.json(leaderBoard);
      console.log(leaderBoard);
    }

  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: error.message });
  }
})

app.post("/createProfile", async (req, res) => {

  const profileData = {
    account: req.body.account,
    address: req.body.address,
    bio: req.body.bio,
    discord: req.body.discord,
    name: req.body.name,
    occupation: req.body.occupation,
    telegram: req.body.telegram,
    username: req.body.username,
    website: req.body.website,
    X : req.body.xDotCom,
    youtube: req.body.youtube
  }

  const wagmiFollow = {
    username: 'WagmiClub'
  }

  try {
    const users = db.collection('users');
    const docId = req.body.username;
    const pfpRef = db.collection('pfps');
    const pfpSnapshot = await pfpRef.get();
    const numberOfDocuments = pfpSnapshot.size;
    const randomIndex = Math.floor(Math.random() * numberOfDocuments);

    let counter = 0;
    let randomDocumentRef;
    pfpSnapshot.forEach((doc) => {
      if (counter === randomIndex) {
        randomDocumentRef = doc.ref;
      }
      counter++;
    });

    const randomDocument = await randomDocumentRef.get();
    const pfp = randomDocument.data().image;

    await users.doc(docId).set(profileData);
    await users.doc(docId).update({ image: pfp });
    await users.doc(docId).collection("followers").add(wagmiFollow);
    await users.doc(docId).collection("following").add(wagmiFollow);

    console.log('success');
    const jsonResponse = { status: "successful" };
    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/createBadge/:orgAddress", async (req, res) => {
  // get address
  const orgAddress = req.params.orgAddress;

  try {
    // increment the counter
    const orgBadgeRef = db.collection('Badges').doc(orgAddress);
    const orgBadgeDoc = await orgBadgeRef.get();
    const users = db.collection('users');
    const userSnapshot = await users.where('address', '==', req.body.receiver).get();
    const userId = userSnapshot.docs[0].id;

    // does not exist deploy and return
    // exist return 
    if (!orgBadgeDoc.exists) {
      // deploy 
      const lspFactory = new LSPFactory(provider, {
        deployKey: privateKey,
        chainId: 4201,
      });
      const deployedContracts = await lspFactory.LSP8IdentifiableDigitalAsset.deploy({
        name: "WAGMI BADGE",
        symbol: "WBG",
        controllerAddress: orgAddress,
        tokenIdType: 0,
      });

      const contractAddress = deployedContracts.LSP8IdentifiableDigitalAsset.address;

      // change owner
      const wallet = new Wallet(privateKey);

      const _provider = new ethers.JsonRpcProvider(provider);
      const signer = wallet.connect(_provider);
      const contract = new ethers.Contract(contractAddress, LSP8ABI, signer);
      const TX = await contract.transferOwnership(orgAddress);
      const receipt = await TX.wait();
      console.log(receipt); 

      const idCount = 0;
      const data = { contractAddress: contractAddress, idCount: idCount }
      await orgBadgeRef.set(data);
      const tokenRef = orgBadgeRef.collection('tokenIds').doc(idCount);
      await tokenRef.set(req.body);
      await db.collection('users').doc(userId).collection('badges').add(req.body);
      res.status(200).json({ contractAddress: contractAddress, id: idCount })
      await orgBadgeRef.update({ idCount: 1 })
    } else {
      const orgBadgeData = orgBadgeDoc.data();
      const contractAddress = orgBadgeData.contractAddress;
      const id = orgBadgeData.idCount;
      const newId = id + 1;
      const tokenRef = orgBadgeRef.collection('tokenIds').doc(newId);
      await tokenRef.set(req.body);
      await orgBadgeRef.update({ idCount: newId })
      res.status(200).json({ contractAddress: contractAddress, id: id })
  }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error })
  }
})

app.post("/mintBadge", async (req, res) => {

  try {
    const badgeRef = db.collection('badges');
    const badgeDetailRef = db.collection('badgeDetails');

    const _count = await badgeDetailRef.doc('details').get();
    const count = _count.data().count;
    const newCount = count + 1;

    await badgeRef.doc(`${count}`).set(req.body);
    await badgeDetailRef.doc('details').update({ count: newCount });

    res.status(200).json({ response: "successful"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error })
  }
})

app.post("/createMedal", async (req, res) => {

  try {
    
    const medalRef = db.collection('medals');
    const medalDetailRef = db.collection('medalDetails');

    const _count = await medalDetailRef.doc('details').get();
    const count = _count.data().count;
    const newCount = count + 1;
    
    await medalRef.doc(`${count}`).set(req.body);
    await medalDetailRef.doc('details').update({ count: newCount });

    res.status(200).json({ response: "successful"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
})

app.post("/participate/:tokenId", async (req, res) => {
  const address = req.body.address;
  const tokenId = req.params.tokenId;

  try {
    const indexRef = await db.collection('medals').doc(tokenId).get();
    const index = indexRef.data().index;
    const newIndex = index + 1;

    const questerObj = {
      address: address,
      claimed: false,
      index: index
    }

    const questerRef = db.collection('medals').doc(tokenId).collection('questers');
    
    await questerRef.add(questerObj);
    await db.collection('medals').doc(tokenId).update({ index: newIndex });

    res.status(200).json({ response: "successful"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error })
  }
})

app.get("/getUserProfileUsername/:username", async (req, res) => {
  const username = req.params.username;

  const userSnapshot = await db.collection('users').doc(username).get();

  try {
    if (!userSnapshot.exists) {
      const Response = { response: "User does not exist" }
      res.status(200);
      res.json(Response);
    } else {
      const userDoc = userSnapshot.data();
      const userResponse = {
        name: userDoc.displayname,
        username: userDoc.username,
        bio: userDoc.bio,
        profession: userDoc.profession,
        imageURL: userDoc.imageURL
      }
      // add number of following and followers
      
      res.status(200);
      res.json(userResponse);
    }
  } catch (error) {
    res.status(500);
    res.json({ error: error.message });
  }

  // add extended params to returned value

})

app.get("/getUserProfileAddress/:address", async (req, res) => {
  const address = req.params.address;

  try {
    const users = db.collection('users');
    const userSnapshot = await users.where('address', '==', address).get();
    const userId = userSnapshot.docs[0].id;

    if (userSnapshot.empty) {
      const Response = { message: "User does not exist" }
      res.status(404);
      res.json(Response);
    } else {
      const userDoc = userSnapshot.docs[0].data();
      // get followers
      const _followerCount = await db.collection('users').doc(userId).collection('followers').get();
      const followerCount = _followerCount.size;
      // get following
      const _followingCount = await db.collection('users').doc(userId).collection('following').get();
      const followingCount = _followingCount.size;

      // get 4 badges
      const badgeList = await db.collection('badges').where('receiver', '==', address).limit(4).get();
      const badges = []

      const medalIds = [];
      const medalsSnanpshot = await db.collection('medals').get();
      medalsSnanpshot.forEach(doc => {
        const mintersArray = doc.data().minters;
        console.log(mintersArray);
        if (mintersArray.includes(address))
          medalIds.push(doc.id);
      })

      console.log(medalIds);

      const medals = []

      const bio = {
        name: userDoc.name,
        username: userDoc.username,
        bio: userDoc.bio,
        profession: userDoc.occupation,
        // imageURL: userDoc.imageURL,
        followers: followerCount,
        following: followingCount,
        discord: userDoc.discord,
        x: userDoc.X,
        telegram: userDoc.telegram,
        website: userDoc.website
      }

      for (let i = 0; i < badgeList.docs.length; i++) {
        const title = badgeList.docs[i].data().title;
        const imageURL = badgeList.docs[i].data().image;
        const badgeObj = {
          id: i,
          value: {
            image: imageURL,
            verified: true,
            name: title,
            info: {
              headImg: badgeList.docs[i].data().image,
              created: await getCreator(badgeList.docs[i].data().minter),
              transacId: "0x", // store transaction id
              desc: badgeList.docs[i].data().description,
              time: {
                start: badgeList.docs[i].data().startDate,
                end: badgeList.docs[i].data().endDate
              },
              validator: badgeList.docs[i].data().validator,
              rating: badgeList.docs[i].data().rating
            }
          },
        };
        badges.push(badgeObj)
      }

      for (let i = 0; i < medalIds.length; i++) {
        const id = Number(medalIds[i]);
        const medalSnapshot = await db.collection('medals').doc(`${id}`).get();
        const medalObj = {
          id: id,
          value: {
            title: medalSnapshot.data().title,
            host: await getCreator(medalSnapshot.data().creator),
            type: medalSnapshot.data().alphaType,
            image: medalSnapshot.data().image
          }
        }

        medals.push(medalObj);
        
      }

      const userResponse = {
        bio: bio,
        badges: badges,
        medals: medals
      }
      
      res.status(200);
      res.json(userResponse);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: error.message });
  }

  // add extended params to returned value

})

const getCreator = async(address) => {
  const users = db.collection('users');
  const userSnapshot = await users.where('address', '==', address).get();

  const userDoc = userSnapshot.docs[0].data();
  const username = userDoc.username;

  return username;
}

const getImage = async(address) => {
  try {
    const users = db.collection('users');
    const userSnapshot = await users.where('address', '==', address).get();
  
    const userDoc = userSnapshot.docs[0].data();
    const image = userDoc.image;
    console.log(image);
  
    return image;
  } catch (error) {
    console.log(error);
  }
}

app.get("/getAllMedals/:address", async (req, res) => {  

  const address = req.params.address;

  try {
    const medals = db.collection('medals');
    const allMedals = await medals.get();
    const medalArray = [];
    const medalsCount = allMedals.size;

    for (let i = 0; i < medalsCount; i++) {
      const medal = await medals.doc(`${i}`).get();
      const title = medal.data().title;
      const image = medal.data().image;
      const type = medal.data().alphaType;
      const id = i;
      const _creator = medal.data().creator;
      const creator = await getCreator(_creator);
      const description = medal.data().addtionalInfo;

      const medalDetails = {};
      const value = {}
      value.id = id;
      value.title = title;
      value.host = creator;
      value.metrics = type;
      value.hostImage = await getImage(_creator);
      value.medalImage = image;
      value.description = description;
      value.time = {
        start: medal.data().startDate,
        end: medal.data().endDate
      };
      value.quantity = {
        total: medal.data().total,
        remaining: medal.data().remaining
      }

      const participantObject = await getParticipants(`${i}`, address);
      value.participants = participantObject.participants;
      value.isParticipant = participantObject.isParticipant;

      var claimed;
      const questerRef = db.collection('medals').doc(`${i}`).collection('questers');
      const questerSnapshot = await questerRef.where('address', '==', address).get();
      if (questerSnapshot.empty) {
        claimed = false;
      } else {
        claimed = questerSnapshot.docs[0].data().claimed;
      }

      const _isCreator = await isCreator(`${i}`, address);
      
      value.claimed = claimed;
      value.isCreator = _isCreator;

      medalDetails.id = id;
      medalDetails.value = value;

      medalArray.push(medalDetails);
    }

    res.status(200);
    res.json(medalArray);
  
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: error.message });
  }

  // add extended params to returned value

})

const getParticipants = async(id, address) => {
  const participants = [];
  var isParticipant;
  try {
  // get medal ref
  const medalRef = db.collection('medals').doc(`${id}`);
  // get questers ref
  const questersSnapshot = await medalRef.collection('questers').get();
  if (questersSnapshot.empty) {
    isParticipant = false;
    return { participants, isParticipant };
  }

  questersSnapshot.forEach(async (doc) => {
    const _participant = await getImage(doc.data().address);
    if (doc.data().address == address) {
      isParticipant = true;
    } else {
      isParticipant = false;
    }
    const participant = _participant.toString();
    participants.push(participant);
  });

  return { participants, isParticipant };
  
  } catch (error) {
    console.log(error);
  }

}

const isCreator = async(id, address) => {
  try {
    const medalRef = db.collection('medals').doc(`${id}`);
    const medalDoc = await medalRef.get();
    if (!medalDoc.exists) {
      return false;
    }
    const creator = medalDoc.data().creator;

    if (creator == address) {
      return true;
    }

    else {
      return false;
    }

  } catch (error) {
    console.log(error);
  }
}

app.get("/checkUser/:address", async (req, res) => {
  const address = req.params.address;
  try {
    const users = db.collection('users');
    const userSnapshot = await users.where('address', '==', address).get();
    
    if (userSnapshot.empty) {
      res.status(200).json({ exists: false })
    } else {
      res.status(200).json({ exists: true })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
})

app.get("/getUPProfile/:username", async (req, res) => {
  const username = req.params.username;

  const userSnapshot = await db.collection('users').doc(username).get();

  try {
    if (!userSnapshot.exists) {
      const Response = { response: "User does not exist" }
      res.status(200);
      res.json(Response);
    } else {
      const userDoc = userSnapshot.data();
      const userResponse = {
        name: userDoc.displayname,
        username: userDoc.username,
        bio: userDoc.bio,
        profession: userDoc.profession,
        imageURL: userDoc.imageURL
      }
      // recontrsuct in up profile format
      res.status(200);
      res.json(userResponse);
    }
  } catch (error) {
    res.status(500);
    res.json({ error: error.message });
  }

})

app.put("/edit-profile/:username", async (req, res) => {
  const username = req.params.username;
  const { section, value } = req.body;

  const userRef = db.collection('users').doc(username);
  const userSnapshot = await userRef.get();

  try {
    if (!userSnapshot.exists) {
      const Response = { response: "user does not exist" }
      res.status(404);
      res.json(Response);
    } else {
      if (section == "displayname") {
        await userRef.update({ displayname: value });
      } else if(section == "bio") {
        await userRef.update({ displayname: value });
      }
      else if(section == "X") {
        await userRef.update({ X: value });
      }
      else if(section == "discord") {
        await userRef.update({ discord: value });
      }
      else if(section == "telegram") {
        await userRef.update({ telegram: value });
      }
      else if(section == "youtube") {
        await userRef.update({ youtube: value });
      }
      else {
        const Response = { response: "invalid profile field" }
        res.status(400);
        res.json(Response);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: error.message });
  }
})

app.put("/followUser/:username", async (req, res) => {
  const username = req.params.username;
  const follower = req.body.username;

  try {
    const follwerDoc = {
      username: follower
    }

    const userRef = db.collection('users').doc(username);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      const Response = { response: "user does not exist" }
      res.status(404);
      res.json(Response);
    } else {
      await userRef.collection('followers').add(follwerDoc);
      res.status(200).json({ response: 'followed successfuly' });
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: error.message });
  }
})

app.put("/unFollowUser/:username", async (req, res) => {
  const username = req.params.username;
  const follower = req.body.username;

  try {

    const collRef = db.collection('users').doc(username).collection('followers');
    const userSnapshot = await collRef.where('username', '==', follower).get();

    if (!userSnapshot.exists) {
      const Response = { response: "user does not exist" }
      res.status(404);
      res.json(Response);
    } else {
      const id = userSnapshot.docs[0].id;
      await userRef.collection('followers').doc(id).delete();
      res.status(200).json({ response: 'unfollowed successfuly' });
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: error.message });
  }
})

app.put("/updateBadgeAddress/:orgAddress", async(req, res) => {
  const orgAddress = req.params.orgAddress;
  const contractAddress = req.body.contractAddress;

  try {
    const docRef = db.collection('Badges').doc(orgAddress);
    const doc = await docRef.get();
    if (!doc.exists) {
      const Response = { message: 'this resource does not exist' }
      res.status(200);
      res.json(Response);
    } else {
      const data = doc.data();
      await docRef.update({ contractAddress: contractAddress })
      const Response = { message: 'successful' }
      res.status(200);
      res.json(Response);
    }
  } catch (error) {
    console.log(error);
    const Response = { error: error }
    res.status(500);
    res.json(Response);
  }
});

// endpoint to store the address
// endpoint to get badge details

const getTransactionAmount = async () => {
  const address = "0x68360457a590318778fC346CDe64E327Dc6A5C0a";
  const _chain = "Viction";
  const contractAddress = "0xdef1c0ded9bec7f1a1670819833240f027b25eff";

  var chain;
  switch (_chain) {
    case "Viction":
      chain = "tomochain-testnet";
      break;
  case "Eth Sepolia":
      chain = "eth-sepolia";
      break;
  case "Polygon Mumbai":
      chain = "matic-mumbai";
      break;
  case "BSC Testnet":
      chain = "bsc-testnet";
      break;
  default:
      chain = "tomochain-testnet";
  }

  try {
    const client = new CovalentClient(covalentApiKey);

    for await (const request of client.TransactionService.getAllTransactionsForAddress(chain, address)) {
      if (!request.error) {
        console.log(request.data.items);
        const amount = sumTransactionAmount(request.data.items, contractAddress);
        console.log(amount);
        return amount;
    } else {
        console.log(request.error_message);
    }
  }
  } catch (error) {
    console.log(error);
  }

}

const victionNftCheck = async(address) => {
  try {
    const client = new CovalentClient(covalentApiKey);
    const queryParamOpts = {
      withUncached: true,
    };
    const request = await client.NftService.getNftsForAddress("tomochain-testnet", address, queryParamOpts);
    if (!request.error) {
        console.log(request.data.items);
        return request.data.items;
    } else {
        console.log(request.error_message);
    }
  } catch (error) {
    console.log(error);
  }
}

const sumTransactionAmount = (data, contractAddress) => {
    // Initialize a variable to store the sum
    let totalValue = 0;

    // Iterate through the "result" array and sum the "value" where "to_address" matches the specific address
    data.result.forEach(result => {
      if (result.to_address === contractAddress) {
        totalValue += Number(result.value);
      }
    });
    return totalValue;
}

// Call startServer()
startServer();