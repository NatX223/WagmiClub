import { Verified } from "@/assets/icons";
import Profile from "@/app/profile/page";
import { LandingProfile } from "..";
import "./index.scss";

export const PoweredBy = ({ group }: { group: string }) => {
	function RenderButtons() {
		return (
			<div className={`${group}__powered-buttons`}>
				<button>
					<span>
						<img src="/Frencansto.jpg" />
					</span>
					<span>@elonmusk</span>
					<span>
						<Verified />
					</span>
				</button>

				<button>
					<span>
						<img src="/defi_pfp.jpg" />
					</span>
					<span>@defiprince_</span>
				</button>
			</div>
		);
	}

	return (
		<section className={`${group}__powered`}>
			<div className={`${group}__powered-wrapper`}>
				<div className={`${group}__powered-top`}>
					<RenderButtons />

					<div className={`${group}__powered-profile`}>
						<LandingProfile />
					</div>
				</div>
				<div className={`${group}__powered-bottom`}>
					<b>Powered By</b>

					<div>
						<img
							src="/chainlinkLogo.jpg"
							alt=""
						/>
					</div>

					<div>
						<i>
							<img
								src="/base.png"
								alt=""
							/>
						</i>
					</div>
				</div>
			</div>
		</section>
	);
};
