import { MedalDetails } from "@/app/explore/[id]/page";
import { useAccount } from 'wagmi'
import { ORGANIZATION_MEDALS } from "@/assets/data";
import { Badge } from "@/components";
import { useFetch } from "@/hooks/useFetch";
import "./index.scss";

export const RenderOrgMedals = function ({ group }: { group: string }) {
	return (
		<div className={`${group}__medals`}>
			{ORGANIZATION_MEDALS.map((item: any, index: number) => {
				const { id, value } = item;

				return (
					<div
						key={index | id}
						className={`${group}__medal`}
					>
						<Badge
							group={`${group}__medal`}
							{...value}
						/>
					</div>
				);
			})}
		</div>
	);
};
export const OnChain = ({ group }: { group: string }) => {
	const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;
	const account = useAccount();
	const address = account.address || "";
	// const { address } = useWeb3ModalAccount();
	const API = `${baseApiUrl}getAllMedals/${address}`;

	const { data, loading, error } = useFetch({ url: API });
	const MEDALS = data as string[];

	return loading ? (
		<p>Loading...</p>
	) : error ? (
		<p>Error loading Medals. please check your internet connection</p>
	) : (
		<section className={`${group}`}>
			<div className={`${group}__wrapper`}>
				<div className={`${group}__medals`}>
					{MEDALS.map((item: any, index: number) => {
						const { id, value } = item;

						return (
							<div
								key={index | id}
								className={`${group}__medal-detail`}
							>
								<MedalDetails
									group={`${group}__medal-detail`}
									{...value}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};
