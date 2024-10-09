import React, { FC } from "react";

interface props {
	group: string;
	title: string;
	host: string;
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
}

export const MedalDetails: FC<props> = ({
	group,
	title,
	image,
	description,
	host,
	metrics,
	participants,
	claimed,
	time: { start, end },
	quantity: { total, remaining },
}) => {
	return (
		<section className={group}>
			<div className="wrapper">medal details</div>
		</section>
	);
};
