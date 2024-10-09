import { Verified, Badge, Location, Creator } from "@/assets/icons";
import "./index.scss";
import { FC } from "react";

interface props {
	group: string;
	name: string;
	username: string;
	bio: string;
	profession: string;
	followers: number;
	following: number;
	discord: string;
	x: string;
	telegram: string;
	website: string;
}

export const Bio: FC<props> = ({
	group,
	name,
	username,
	bio,
	profession,
	followers,
	following,
	discord,
	x,
	telegram,
	website,
}) => {
	return (
		<section className={`${group}`}>
			<div className={`${group}__wrapper`}>
				<div className={`${group}__top`}>
					<h1>
						<span>{name}</span>
						<i>
							<Badge />
						</i>
						<i>
							<Verified />
						</i>
					</h1>

					<p>@{username}</p>
				</div>

				<div className={`${group}__center`}>
					<p className={`${group}__center-text`}>{bio}</p>
					<div className={`${group}__center-buttons`}>
						<div className={`${group}__center-buttons-left`}>
							<i>
								<Location />
							</i>
							<p>United States</p>
							<picture>
								<source
									type="image/webp"
									srcSet="https://flagcdn.com/16x12/ca.webp,
                                        https://flagcdn.com/32x24/ca.webp 2x,
                                        https://flagcdn.com/48x36/ca.webp 3x"
								/>
								<source
									type="image/png"
									srcSet="https://flagcdn.com/16x12/ca.png,
                                        https://flagcdn.com/32x24/ca.png 2x,
                                        https://flagcdn.com/48x36/ca.png 3x"
								/>
								<img
									src="https://flagcdn.com/16x12/ca.png"
									width="16"
									height="12"
									alt="Ukraine"
								/>
							</picture>
						</div>

						<div className={`${group}__center-buttons-right`}>
							<i>
								<Creator />
							</i>
							<p>{profession}</p>
						</div>
					</div>
				</div>

				<div className={`${group}__bottom`}>
					<div>
						<b>{following}</b>
						<span>following</span>
					</div>
					<div>
						<b>{followers}</b>
						<span>followers</span>
					</div>
				</div>
			</div>
		</section>
	);
};
