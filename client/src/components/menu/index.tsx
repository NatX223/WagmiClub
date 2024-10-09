"use client";

import { Hamburger } from "@/assets/icons";
import { useToggle } from "@/hooks";
import { Modal } from "@/views";
import { useAccount } from 'wagmi';
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MenuModal } from "..";
import "./index.scss";

export const Menu = () => {
	const account = useAccount();
	const isConnected = account.isConnected;
	const address = account.address || "";

	const router = useRouter();
	// const { address, isConnected } = useWeb3ModalAccount();
	const { status: isMenuActive, toggleStatus: setIsMenuActive } = useToggle();

	const baseAPIURL = process.env.NEXT_PUBLIC_API_URL;

	useEffect(() => {
		// Toggle background vertical scroll when menu is active
		const scroll = isMenuActive ? "hidden" : "visible";
		document.body.style.overflowY = scroll;
	}, [isMenuActive]);

	useEffect(() => {
		isConnected &&
			(async () => {
				const { exists } = (
					await axios.get(`${baseAPIURL}checkUser/${address}`)
				).data;

				!exists && router.replace("/profile/edit");
			})();
	}, [isConnected]);

	return (
		<section className="menu">
			<div className="menu-wrapper">
				<button onClick={setIsMenuActive}>
					<Hamburger />
				</button>

				<Modal
					isOpen={isMenuActive}
					onClose={setIsMenuActive}
				>
					<MenuModal
						onClose={() => {
							setIsMenuActive();
						}}
					/>
				</Modal>
			</div>
		</section>
	);
};
