"use client";

import { DESKTOP_NAV_LINKS } from "@/assets/data";
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { RenderLoginButton } from "@/components/navbar";
import { Search } from "@/assets/icons";
import { truncateWalletAddress } from "@/utils";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import Link from "next/link";
import "./index.scss";

const MenuModal = ({ onClose }: { onClose: () => void }) => {
	const { open } = useWeb3Modal();
	// const { address, isConnected } = useWeb3ModalAccount();

	return (
		<div className="content__wrapper">
			<ul className="navigation">

				<RenderLoginButton />

				{DESKTOP_NAV_LINKS.map((item) => {
					const {
						id,
						value: { title, to },
					} = item;

					return (
						<li
							key={id}
							onClick={onClose}
						>
							<Link href={to}>{title}</Link>
						</li>
					);
				})}
			</ul>

			{/* Search input */}
			<div className="search">
				<input
					type="text"
					placeholder="search"
				/>
				<span>
					<Search />
				</span>
			</div>
		</div>
	);
};

export { MenuModal };
