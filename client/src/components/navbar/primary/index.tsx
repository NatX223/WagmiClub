"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { DESKTOP_NAV_LINKS } from "@/assets/data";
import { Logo, Menu } from "@/components";
import { useHydration, useUserStore } from "@/hooks";
import { truncateWalletAddress } from "@/utils";
import { getBasenameNav } from "@/utils/basename/resolver";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./index.scss";

function RenderNavLinks() {

	const hydration = useHydration();
	return (
		<>
			<ul className="primaryNav__desktop">
				{/* Mapping through desktop navigation links */}
				{DESKTOP_NAV_LINKS.map((item, index) => {
					const {
						id,
						value: { title, to },
					} = item;
					return (
						<ListItem
							key={id || index}
							title={title}
							to={to}
						/>
					);
				})}

				{/* Login Button */}
				{hydration && <RenderLoginButton />}
			</ul>
		</>
	);
}

function ListItem({ title, to }: { title: string; to: string }) {
	return (
		<>
			<li>
				{/* Link to specific route */}
				<Link href={to}>{title}</Link>
			</li>
		</>
	);
}

export function RenderLoginButton() {
  const account = useAccount();
  const isConnected = account.isConnected;
  const address = account.address || ""; // Fallback to an empty string
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[1];

  const [basename, setBasename] = useState<string>(""); // State to hold basename

  // Fetch basename when the address changes
  useEffect(() => {
    const fetchBasename = async () => {
      if (address) {
        const result = await getBasenameNav(address);
        setBasename(result || ""); // Set basename or fallback to empty string
		console.log(address, result);
      }
    };

    fetchBasename();
  }, [address]); // Trigger the effect when the address changes

  return (
    <>
      <li onClick={() => connect({ connector })}>
        {isConnected ? (
          <span>
			<button
				className="disconnect__submit-button"
				type="button"
				onClick={() => disconnect()}
			>
			<span> 
				{basename === address ? (
				<span>{truncateWalletAddress(address)}</span>
				) : (
				<span>{basename}</span>
				)}
			</span>
			</button>
          </span>
        ) : (
          "Connect"
        )}
      </li>
    </>
  );
}
  
export const PrimaryNav = () => {
	const router = useRouter();

	const { setUserName, setUserTitle } = useUserStore();

	const account = useAccount();
	const isConnected = account.isConnected;
	const address = account.address || "";

	// const { address, isConnected } = useWeb3ModalAccount();

	const baseApiUrl = process.env.NEXT_PUBLIC_API_URL;

	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		isConnected &&
			(async () => {
				const { exists } = (
					await axios.get(`${baseApiUrl}checkUser/${address}`)
				).data;

				!exists && router.replace("/profile/edit");
				exists && router.push("/profile");

				const response = (
					await axios.get(
						`${baseApiUrl}getUserProfileAddress/${address}`,
					)
				).data;

				setUserName(response.bio.name);
				setUserTitle(response.bio.profession);
			})();
	}, [isConnected, address, baseApiUrl, router, setUserName, setUserTitle]);

	return (
		<nav className="primaryNav">
			{/* Wrapper for the logo, mobile menu, and desktop navigation */}
			<div className="primaryNav__wrapper">
				{/* Application Logo */}
				<Logo />

				{/* Navigation Menu (Mobile) */}
				<Menu />

				{/* Navigation Menu (Desktop) */}
				<RenderNavLinks />
			</div>
		</nav>
	);
};

export default PrimaryNav;
