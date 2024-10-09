import "@/styles/main.scss";
import { ReactNode } from "react";
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'

import { getConfig } from '@/wagmi'
import { Providers } from '@/app/providers'

export const metadata = {
	title: "WagmiClub",
	description: "The club with the Magic Badge",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	const initialState = cookieToInitialState(
		getConfig(),
		headers().get('cookie'),
	)
	return (
		<html lang="en">
			<body className={`container`}>
				<Providers initialState={initialState}>
					<section>{children}</section>
				</Providers>
			</body>
		</html>
	);
}
