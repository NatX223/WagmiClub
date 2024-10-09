"use client";

import { FC } from "react";
import { ReputationMedal, ReputationView as ButtonIcon } from "@/assets/icons";

interface props {
	name: string;
	title: string;
	image: string;
	medals: number;
	group: string;
}

export const Medal: FC<props> = ({ name, title, image, medals, group }) => {
	return (
		<section className={`${group}__wrapper`}>
			<div className={`${group}__image`}>
				<span>
					<img
						src={image}
						alt={name}
					/>
				</span>
			</div>

			<div className={`${group}__title`}>
				<span>{name}</span>
				<span>{title}</span>
			</div>

			<div className={`${group}__footer`}>
				<div className={`${group}__medal`}>
					<span>{medals}</span>
					<span>
						<ReputationMedal />
					</span>
				</div>

				<button className={`${group}__button`}>
					<span>
						<ButtonIcon />
					</span>
				</button>
			</div>
		</section>
	);
};
