import { SecondaryNav } from "@/components";
import { BreakpointCheck, Web3Modal } from "@/hooks";
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'

import { getConfig } from '@/wagmi'
import { Providers } from '@/app/providers'

import "@/styles/main.scss";
import { ReactNode } from "react";

export const metadata = {
	title: "Profile - WagmiClub",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	const initialState = cookieToInitialState(
		getConfig(),
		headers().get('cookie'),
	)
	return (
		<html lang="en">
			<body className="container">
				<Providers initialState={initialState}>
					<BreakpointCheck>
						<SecondaryNav />
						<section>{children}</section>
					</BreakpointCheck>
				</Providers>
			</body>
		</html>
	);
}
