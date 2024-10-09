"use client";

import React, { ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import { usePathname } from "next/navigation";
import { BreakpointText } from "@/components";
import { useHydration } from ".";

const BreakpointCheck = ({ children }: { children: ReactNode }) => {
	const matches = useMediaQuery("(max-width: 40em)");

	const pathname = usePathname();
	const hydrated = useHydration();

	let text: string | null;

	switch (pathname) {
		case "/explore":
			text = "to explore badges & profiles, switch to a mobile device";
			break;
		case "/create":
			text =
				"to create medals & claim profiles, switch to a mobile device";
			break;
		default:
			text = "please switch to a mobile device to view this page";
	}

	const render = matches ? <>{children}</> : <BreakpointText text={text} />;

	return <>{hydrated && render}</>;
};

export { BreakpointCheck };
