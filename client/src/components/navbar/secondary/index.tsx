"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo, ProfileModal, SearchModal } from "@/components";
import { useAccount } from 'wagmi';
import axios from "axios";
import { Search_White } from "@/assets/icons";
import { useToggle } from "@/hooks";
import { Modal } from "@/views";
import { getBasename, getBasenameAvatar } from "@/utils/basename/resolver";
import "./index.scss";

export const SecondaryNav = () => {
	const pathname = usePathname();

	const { status: isProfileModalOpen, toggleStatus: setIsProfileModalOpen } =
		useToggle();

	const { status: isSearchModalOpen, toggleStatus: setIsSearchModalOpen } =
		useToggle();

	useEffect(() => {
		// Toggle background vertical scroll when menu is active
		const scroll =
			isProfileModalOpen || isSearchModalOpen ? "hidden" : "visible";
		document.body.style.overflowY = scroll;
	}, [isProfileModalOpen, isSearchModalOpen]);

	const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;

	const [avatar, setAvatar] = useState<string | null>(null);
	const [user, setUser] = useState<string | null>(null);
	const [title, setTitle] = useState<string | null>(null);

	const account = useAccount();
	const isConnected = account.isConnected;
	const address = account.address || ""; // Fallback to an empty string

	useEffect(() => {
		isConnected &&
			(async () => {
				if (address) {
					const basename = await getBasename(address);
			
					const { exists } = (
						await axios.get(`${baseApiUrl}checkUser/${address}`)
					).data;

					if (exists) {
						const response = (
							await axios.get(`${baseApiUrl}getUserProfileAddress/${address}`)
						).data;
						setTitle(response.bio.profession);
						setUser(response.bio.username);
					}

					if (basename && basename.endsWith(".base.eth")) {
					  // Fetch avatar
					  const avatar = await getBasenameAvatar(basename) || "";
			
					  // Set the user details
					  setAvatar(avatar);
					}
				  }
			})();
	}, [isConnected, address, baseApiUrl]);

	return (
		<nav className="secondaryNav">
			{/* Wrapper for the logo and right column */}
			<div className="secondaryNav__wrapper">
				{/* Application Logo */}
				<Logo />

				{/* Right column containing create link, search, and profile */}
				<div className="secondaryNav__right-col">
					{/* Create Link */}
					<div className="secondaryNav__item secondaryNav__create">
						<Link
							className={`${
								pathname === "/create" ? "active" : ""
							}`}
							href="/create"
						>
							Create
						</Link>
					</div>

					{/* Search */}
					<div className="secondaryNav__search">
						<button onClick={() => setIsSearchModalOpen()}>
							<span>
								<Search_White />
							</span>
						</button>

						<Modal
							isOpen={isSearchModalOpen}
							onClose={() => setIsSearchModalOpen()}
						>
							<SearchModal
								onClose={() => setIsSearchModalOpen()}
							/>
						</Modal>
					</div>

					{/* Profile */}
					<div className="secondaryNav__profile">
						<button onClick={() => setIsProfileModalOpen()}>
							<span>
							<img
								src={avatar ? avatar : "defi_pfp.jpg"}
								alt="profile_pic"
							/>
							</span>
						</button>

						<Modal
							isOpen={isProfileModalOpen}
							onClose={() => setIsProfileModalOpen()}
						>
						<ProfileModal
							onClose={() => setIsProfileModalOpen()}
							user={user || ""}
							title={title || ""}
						/>
						</Modal>
					</div>
				</div>
			</div>
		</nav>
	);
};
