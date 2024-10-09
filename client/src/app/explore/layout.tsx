import { ReactNode } from "react";
import { BreakpointCheck, Web3Modal } from "@/hooks";
import { SecondaryNav } from "@/components";
import "@/styles/main.scss";

import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { getConfig } from '@/wagmi'
import { Providers } from '@/app/providers'

export const metadata = {
	title: "Profile - Explore",
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
