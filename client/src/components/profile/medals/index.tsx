import { ORGANIZATION_MEDALS } from "@/assets/data";
import "./index.scss";
import { Badge, RenderOrgMedals } from "@/components";

const Medals = ({ group }: { group: string }) => {
	return (
		<section className={`${group}`}>
			<div className={`${group}__wrapper`}>
				<h3 className={`${group}__title`}>Medals</h3>

				{/* <RenderOrgMedals group={group} /> */}
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
			</div>
		</section>
	);
};

export { Medals as ProfileMedals };
