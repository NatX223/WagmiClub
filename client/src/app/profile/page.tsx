"use client";

import { X } from "@/assets/icons";
import {
	Actions,
	Bio,
	LoadingCloud,
	ProfileBadges,
	ProfileMedals,
	TrustScores,
} from "@/components";
import { useUserStore } from "@/hooks";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./page.scss";

interface Medal {
	id: number;
	value: {
		image: string;
		verified: boolean;
		name: string;
		headImg: string;
		created: string;
		transacId: string;
		desc: string;
		time: {
			start: string;
			end: string;
		};
		validator: string;
		rating: number;
	};
}

interface Badge {
	id: number;
	value: {
		verified: boolean;
		name: string;
		created: string;
		transacId: string;
		desc: string;
		time: {
			start: string;
			end: string;
		};
		validator: string;
		rating: number;
	};
}

interface Bio {
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

interface UserProfileData {
	bio: Bio;
	badges: Badge[];
	medals: Medal[];
}

const Profile = () => {
	const account = useAccount();
	const isConnected = account.isConnected;
	const address = account.address || ""; // Fallback to an empty string
	const { connectors, connect } = useConnect();
	const { disconnect } = useDisconnect();
	const connector = connectors[1];

	const group = "profile";
	const router = useRouter();
	const { setUserName, setUserTitle } = useUserStore();

	// const { address, isConnected } = useWeb3ModalAccount();
	// const { open } = useWeb3Modal();

	const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;

	const [profile, setProfile] = useState<UserProfileData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		isConnected &&
			(async () => {
				// Check if user exists
				const { exists } = (
					await axios.get(`${baseApiUrl}checkUser/${address}`)
				).data;

				!exists && router.replace("/profile/edit");

				// fetch user profile
				const response = (
					await axios.get(
						`${baseApiUrl}getUserProfileAddress/${address}`,
					)
				).data;

				setProfile(response);
				setLoading(false);
				setUserName(response.bio.name);
				setUserTitle(response.bio.profession);
			})();
	}, [isConnected, address, router, baseApiUrl, setUserName, setUserTitle]);



	return (
		<section className={`${group}`}>
			<section className={`${group}__wrapper`}>
				{/* Conditional rendering based on loading state */}
				{loading && (
					<>
						<LoadingCloud />
						{!isConnected && (
							<p>
								Cannot load profile <br />
								Please{" "}
								<button
									style={{
										paddingInline: ".25rem",
										borderRadius: ".25rem",
									}}
									onClick={() => connect({ connector })}
								>
									connect
								</button>{" "}
								your wallet
								<br />
							</p>
						)}
					</>
				)}

				{/* Conditional rendering based on error state */}
				{/* {error && <p>Error loading data: {error.message}</p>} */}

				{/* Render other components only if data is available and no error occurred */}
				{profile && (
					<>
						<Actions group={`${group}__actions`} />

						<Bio
							group={`${group}__bio`}
							{...profile.bio}
						/>

						<ProfileBadges
							group={`${group}__badges`}
							badges={profile.badges}
						/>

						<TrustScores group={`${group}__trustscores`} />

						<ProfileMedals
							group={`${group}__medals`}
							{...profile.medals}
						/>

						<section className={`${group}__socials`}>
							{profile.bio.x && (
								<Link href={`https://x.com/${profile.bio.x}`}>
									<X />
								</Link>
							)}
							{profile.bio.x && (
								<Link href={`https://x.com/${profile.bio.x}`}>
									<X />
								</Link>
							)}
							{profile.bio.x && (
								<Link href={`https://x.com/${profile.bio.x}`}>
									<X />
								</Link>
							)}
							{profile.bio.x && (
								<Link href={`https://x.com/${profile.bio.x}`}>
									<X />
								</Link>
							)}
						</section>
					</>
				)}
			</section>
		</section>
	);
};

export default Profile;
