export const BASE_API_URL = "https://wagmi-backend.up.railway.app/";

export const BADGE_CONTRACT_ADDRESS =
	"0xCfD0BC91213D1351514f0436E2FEd65850DFBc59";
export const BADGE_ABI = [
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address",
			},
		],
		name: "mint",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];

export const MEDAL_CONTRACT_ADDRESS =
	"0x5Da8DFd3c344Dd960A8956973591d21cC2209e33";
export const MEDAL_ABI = [
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_deadline",
				type: "uint256",
			},
		],
		name: "createMedal",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_tokenId",
				type: "uint256",
			},
		],
		name: "registerInterest",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
