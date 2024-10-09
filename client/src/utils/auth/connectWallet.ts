import { BrowserProvider, Signer } from "ethers";

// Check if the window object is defined
const isBrowser = typeof window !== "undefined";

// Access the ethereum object from the window if in a browser environment
const ethereum = isBrowser ? (window as any).ethereum : undefined;

// Mumbai testnet chain configuration
const MUMBAI_CHAIN = {
	chainId: "0x13881",
};

// Mumbai testnet chain information
const MUMBAI_CHAIN_INFO = {
	chainId: "0x13881",
	chainName: "Mumbai testnet",
	rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
};

/**
 * Switches the provider to the Mumbai testnet
 * @param provider - The current Ethereum provider
 * @returns A signer or error message
 */
async function switchToMumbai(
	provider: BrowserProvider,
): Promise<Signer | string> {
	try {
		// Try switching to the Mumbai chain
		await ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [MUMBAI_CHAIN],
		});
		// Request accounts from the provider
		await provider.send("eth_requestAccounts", []);
		// Get the signer from the provider
		const signer = await provider.getSigner();
		return signer;
	} catch (error: any) {
		switch (error.code) {
			// If the error code is 4902, try adding the Ethereum chain
			case 4902:
				try {
					await ethereum.request({
						method: "wallet_addEthereumChain",
						params: [MUMBAI_CHAIN_INFO],
					});
					// Retry switching to the Mumbai chain
					await ethereum.request({
						method: "wallet_switchEthereumChain",
						params: [MUMBAI_CHAIN],
					});
				} catch (error) {
					// Log and return the error message
					console.error("Error adding Ethereum chain: ", error);
					return `Error adding Ethereum chain: ${error}`;
				}
			// For other errors, log and return the error message
			default:
				console.error("Error switching to Ethereum chain: ", error);
				return `Error switching to Ethereum chain: ${error}`;
		}
	}
}

/**
 * Connects the wallet and returns the signer
 * @returns A signer or error message
 */
export const connectWallet = async (): Promise<Signer | string> => {
	try {
		// If ethereum is not available, return "No Wallet Installed"
		if (!ethereum) return "No Wallet Installed";

		// Create a new provider using the ethereum object
		const provider = new BrowserProvider(ethereum);
		// Get the current network from the provider
		const currentNetwork = await provider.getNetwork();
		// Get the chain ID as a number
		const currentNetworkId: number = Number(currentNetwork.chainId);

		// Check the current network ID
		switch (currentNetworkId) {
			// If already on the Mumbai testnet, request accounts and return the signer
			case 0x13881:
				await provider.send("eth_requestAccounts", []);
				const signer = await provider.getSigner();

				// Get the signer's address
				const signerAddress = await signer.getAddress();
				console.log("Signer's address:", signerAddress);

				return signer;
			// If not on the Mumbai testnet, switch to the Mumbai chain
			default:
				return switchToMumbai(provider);
		}
	} catch (error) {
		// Log and return the error message
		console.error("Error connecting wallet ", error);
		return `Error connecting wallet ${error}`;
	}
};
