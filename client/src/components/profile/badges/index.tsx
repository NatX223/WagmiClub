import Link from "next/link";
import { QUESTER_BADGE } from "@/assets/data";
import { Badge, Verified } from "@/assets/icons";
import "./index.scss";
import { FC } from "react";

interface props {
	group: string;
	badges: any[];
}

const Badges: FC<props> = ({ group, badges }) => {
	return (
		<section className={`${group}`}>
			<div className={`${group}__wrapper`}>
				<h4>Badges</h4>

				<div>
					{badges.slice(0, 4).map((item, index) => {
						const {
							id,
							value: { image, name, verified },
						} = item;

						return (
							<Link
								// href={`/organizations/${id}`}
								href={""}
								key={id || index}
								className={`${group}__badge`}
							>
								<i>
									<Badge />
								</i>

								<img
									key={id || index}
									src={image}
									alt={name}
								/>

								<span>
									{name}
									{verified && (
										<i>
											<Verified />
										</i>
									)}
								</span>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export { Badges as ProfileBadges };
