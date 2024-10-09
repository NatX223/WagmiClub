import { ethers } from "ethers";
var provider;
var signer;
var userProfile;

const baseAPIURL = "https://wagmibackend.up.railway.app/";

export const badgeContractAddress = "0xB07Ad6e27d4Cf9a1D2bCf965F1eC66B20276c312";
export const badgeABI = [
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address",
			},
		],
		name: "mint",
		outputs: [],			
	},
]

export const medalContractAddress = "0xb7083e647240AeD427b6869A5E84962B4DDEc30c";
const medalABI = [
    {
		"inputs": [],
		"name": "createMedal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
	  {
		"inputs": [
		  {
			"internalType": "address[]",
			"name": "receivers",
			"type": "address[]"
		  },
		  {
			"internalType": "uint256",
			"name": "id",
			"type": "uint256"
		  }
		],
		"name": "batchMint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	  },
];

export const connectWallet = async() => {
    try {
		if(window.ethereum) {
            provider = new ethers.BrowserProvider(window.ethereum);
            const currentNetwork = await provider.getNetwork();
            const _currentNetworkId = currentNetwork.chainId;
            const currentNetworkId = Number(_currentNetworkId);
            if (currentNetworkId === 0x14A34) { // checking if the network is available on the wallet
                await provider.send("eth_requestAccounts", []);
                signer = await provider.getSigner();
            } else {
                try {
                    await ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x14A34' }],
                    });
                    await provider.send("eth_requestAccounts", []);
                    signer = await provider.getSigner();
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        try {
                            await ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                      chainId: '0x14A34',
                                      chainName: 'Base Sepolia',
                                      rpcUrls: ['https://sepolia.base.org'],
                                    },
                                  ],
                            });
                            await ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: '0x14A34' }],
                            });
                            await provider.send("eth_requestAccounts", []);
                            signer = await provider.getSigner();
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        console.log(switchError);
                    }
                }
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x14A34' }],
                  });
            }
        }
        else {
            return("No wallet installed");
        }
    } catch (error) {
        console.error(error);
    }
}

export const connectWallet_ = async () => {
	try {
		if (window.ethereum) {
			provider = new ethers.BrowserProvider(window.ethereum);
			
			// checking if the network is available on the wallet
			await provider.send("eth_requestAccounts", []);
			signer = await provider.getSigner();
			}
			else {
				return "No wallet installed";
			}
			} catch (error) {
				console.error(error);
			}
	}

export const getUserAddress = async () => {
	const address = await signer.getAddress();
	console.log(address);
	return address;
};

export const checkUser = async (address) => {
	try {
		const response = await fetch(`${baseAPIURL}checkUser/${address}`);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const res = await response.json();
		const exists = res.exists;

		if (exists == true) {
			console.log("true");
			return true;
		} else {
			console.log("false");
			return false;
		}
	} catch (error) {
		console.log(error);
	}
};

// sign up
export const signUp = async (profileRequestBody, address) => {
	try {
		profileRequestBody["address"] = address;
		// call create function to API with details
		const endPoint = "createProfile";
		const createProfileEndpoint = baseAPIURL + endPoint;
		const response = await fetch(createProfileEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(profileRequestBody),
		});
		// return API endpoint with userName
		// pass it into the universal profile deploy and deploy UP
		if (!response.ok) {
			throw new Error("Network error");
		}

		console.log("created");
	} catch (error) {
		console.log(error);
	}
};

// function to sign up
export const signIn = async() => {
	await connectWallet();
	const userAddress = await getUserAddress();

	const response = await fetch(
		`${baseAPIURL}/getUserProfileAddress/${userAddress}`,
	);

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await response.json();
	return data;
};

// upload image
export const uploadImage = async (image) => {
	try {
		const formData = new FormData();
		formData.append("file", image);

		// call upload function to API with details
		const endPoint = "uploadImage";

		const uploadEndpoint = baseAPIURL + endPoint;

		const response = await fetch(uploadEndpoint, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error("Server Error");
		}

		const data = await response.json();

		console.log("File uploaded succesfully", data);
		return data.url;
	} catch (error) {
		console.log(error);
	}
};

// mint badge
export const mintBadge = async (mintBody, address) => {
	try {
		const image = mintBody.image;
		const url = await uploadImage(image);
		mintBody.image = url;

		mintBody.minter = address;

		// call mint function to API with details
		const endPoint = "mintBadge";

		const mintBadgeEndpoint = baseAPIURL + endPoint;

		const response = await fetch(mintBadgeEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(mintBody),
		});

		if (!response.ok) {
			throw new Error("Server Error");
		}

		const data = await response.json();

		// const contract = new ethers.Contract(
		// 	badgeContractAddress,
		// 	badgeABI,
		// 	signer,
		// );
		// const TX = await contract.mint(mintBody.receiver);
		// const receipt = await TX.wait();
		// console.log("created", receipt);

		console.log("Minted Successfully", data.response);
	} catch (error) {
		console.log(error);
	}
};

function getNumber(inputString) {
	const numberRegex = /\d+(\.\d+)?/; // Regular expression to match numbers
	const match = inputString.match(numberRegex); // Search for the number in the input string

	if (match) {
		return parseFloat(match[0]); // Parse the matched number and return it as a float
	} else {
		return null; // Return null if no number is found in the string
	}
}

function getType(input) {
	switch (input) {
		case "Top Nft collector":
			return 0;
		case "Donator":
			return 1;
		case "Liquidity provider":
			return 2;
		case "Trading expert":
			return 3;
		case "Bug hunter":
			return 4;
		default:
			return 0; // Return -1 if the input doesn't match any specified type
	}
}

// create medal
export const createMedal = async (createBody) => {
	try {
		// await connectWallet(); shift to frontend (base smart walllet)
		const creator = await getUserAddress(); // same

		const image = createBody.image;
		const url = await uploadImage(image);

		const body = { image: url };
		body.additionalInfo = createBody.additionalInfo;
		body.contractAddress = createBody.address;
		body.chain = createBody.deployChain;
		body.creator = creator;
		body.index = 0;
		body.type = getType(createBody.type);
		body.alphaType = createBody.type;
		body.title = createBody.title;
		body.validator = createBody.validator;
		body.minters = [];

		body.requirement = getNumber(createBody.metrics);

		// call mint function to API with details
		const endPoint = "createMedal";

		const createMedalEndpoint = baseAPIURL + endPoint;

		const response = await fetch(createMedalEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			throw new Error("Server Error");
		}

		const data = await response.json();

		console.log("Created Successfully", data.response, receipt);
	} catch (error) {
		console.log(error.code);
	}
};

// participate
export const medalAction = async (id, claimed, isParticipant, address) => {
	try {
		if (claimed) {
			console.log(claimed);
		}

		if (isParticipant) {
			console.log(isParticipant);
		} else {
			const endPoint = `participate/${id}`;
			console.log(id);
	
			const participateEndpoint = baseAPIURL + endPoint;
	
			const response = await fetch(participateEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ address: address }),
			});
	
			if (!response.ok) {
				throw new Error("Server Error");
			}
	
			const data = await response.json();
	
			console.log("registered Successfully", data.response);
	
		}

	} catch (error) {
		console.log(error);
	}
};

export const getProfile = async () => {
	await connectWallet();
	const address = await getUserAddress();

	try {
		const endPoint = `getUserProfileAddress/${address}`;

		const getProfileEndpoint = baseAPIURL + endPoint;

		const response = await fetch(getProfileEndpoint, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Server Error");
		}

		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.log(error);
	}
};

export const returnProfile = () => {
	return { userProfile };
};

export const getEligible = async (tokenId) => {
	try {
		const endPoint = `getEligibleArray/${tokenId}`;

		const getEligible = baseAPIURL + endPoint;

		const response = await fetch(getEligible, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Server Error");
		}

		const data = await response.json();
		const eligible = data.eligible;
		// if (eligible.length < 1) {
		// 	console.log(eligible);
		// } else {
			// mint to eligible
		// 	const contract = new ethers.Contract(
		// 		medalContractAddress,
		// 		medalABI,
		// 		signer,
		// 	);
		// 	const TX = await contract.batchMint(eligible, tokenId);
		// 	const receipt = await TX.wait();
		// 	console.log("created", receipt);
		console.log(data);
		return eligible;
		
	} catch (error) {
		console.log(error);
	}
};

export const getMessage = (claimed, isCreator, isParticipant) => {
	if (claimed) {
		return "Minted";
	}

	if (isCreator) {
		return "Mint to Eligible";
	}

	if (isParticipant) {
		return "Particpated";
	} else {
		return "Participate";
	}
}