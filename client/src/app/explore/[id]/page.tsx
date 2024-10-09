import { getMessage, medalAction, getEligible, medalContractAddress } from "@/utils/app.mjs";
import { FC } from "react";
import "./page.scss";
import { useAccount } from 'wagmi';
import { useWriteContract } from 'wagmi';
interface props {
	id?: number;
	title: string;
	host: string;
	hostImage: string;
	medalImage: string;
	metrics: string;
	image: string;
	description: string;
	time: {
		start: Date;
		end: Date;
	};
	quantity: {
		total: number;
		remaining: number;
	};
	participants: string[];
	claimed: boolean;
	isCreator: boolean;
	isParticipant: boolean;
}

	const account = useAccount();
	const address = account.address || "";

	const { writeContract } = useWriteContract();
	const abi = [
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
	] as const;

export const MedalDetails: FC<props> = ({
	id,
	title,
	description,
	host,
	hostImage,
	medalImage,
	metrics,
	participants,
	claimed,
	isCreator,
	isParticipant,
	time: { start, end },
	quantity: { total, remaining },
}) => {
	const group = "medal-details";
	const [startDate, endDate] = [new Date(start), new Date(end)];
	const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
	const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	const handleButton = async () => {
		try {
			// write function to handle cases
			if (isCreator) {
				const eligible = await getEligible(id);
				if (eligible.length < 1) {
					console.log(eligible);
				} else {
					writeContract(
						{ 
						  address: medalContractAddress, 
						  abi, 
						  functionName: "batchMint", 
						  args: [eligible, BigInt(id || "")], 
						}
					  )
				}
			}
			await medalAction(id, claimed, isParticipant, address);
		} catch (error) {
			console.log(error);
		}
	};

	const getButtonMessage = () => {
		try {
			const message = getMessage(claimed, isCreator, isParticipant);
			return message;
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<section className={group}>
			<div className={`${group}__wrapper`}>
				<div className={`${group}__image`}>
					<img
						src={medalImage}
						alt={title}
					/>
				</div>
				<div className={`${group}__description`}>
					<div className={`${group}__row`}>
						<span>
							<i
								style={{
									backgroundColor: claimed
										? "#e5f77a"
										: "#64FFA2",
								}}
							></i>
						</span>
						<span className={`${group}__ends`}>
							{claimed
								? "Ended"
								: `Ends in ${daysDiff} ${
										daysDiff === 1 ? "day" : "days"
								  }`}
						</span>
						<span>
							{remaining}/{total}
						</span>
					</div>

					<div className={`${group}__host`}>
						<span>
							<img src={hostImage} />
						</span>
						<span>{host}</span>
					</div>

					<div className={`${group}__row`}>
						<h3>{title}</h3>
						<p>{description}</p>
					</div>

					<div className={`${group}__row`}>
						<span>Winning Metrics</span>
						<span>{metrics}</span>
					</div>

					<div className={`${group}__row`}>
						<span>{claimed ? "Minted by" : "Participants"}</span>
						<div>
							{participants.map((participant, index) => (
								<span
									key={index}
									className={`${group}__participant`}
								>
									<img
										src={participant}
										alt="img"
									/>
								</span>
							))}
						</div>
					</div>

					<div className={`${group}__row`}>
						<button onClick={async () => await handleButton()}>
							{getButtonMessage()}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};
