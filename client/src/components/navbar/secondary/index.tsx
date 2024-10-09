"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Logo, ProfileModal, SearchModal } from "@/components";
import { Search_White } from "@/assets/icons";
import { useToggle } from "@/hooks";
import { Modal } from "@/views";
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
									src="/defi_pfp.jpg"
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
							/>
						</Modal>
					</div>
				</div>
			</div>
		</nav>
	);
};
