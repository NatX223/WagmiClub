// // import { w3Modal } from "@/hooks";
// import { ethers, BrowserProvider } from 'ethers';
// import { useState } from 'react';

// export const useWallet = () => {
//     const [provider, setProvider] = useState();
//     const [library, setLibrary] = useState<ethers.BrowserProvider | undefined>();

//     const connectWallet = async () => {
//         try {
//             const provider = await w3Modal.connect();
//             const library = new ethers.BrowserProvider(provider);
//             setProvider(provider);
//             setLibrary(library);

//             const { chainId } = await library.getNetwork();

//             console.log(chainId);

//         } catch (error) {
//             console.error(error);
//         }
//     };

//     return { provider, library, connectWallet };
// };
