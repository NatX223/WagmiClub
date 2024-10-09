"use client";

import { useIsomorphicLayoutEffect } from "usehooks-ts";

// https://github.com/wagmi-dev/viem/discussions/781
export function useShutTheFuckUpAboutENS() {
	useIsomorphicLayoutEffect(() => {
		const orig = window.console.error;
		window.console.error = function (...args) {
			if (args[0]?.name === "ChainDoesNotSupportContract") return;
			orig.apply(window.console, args);
		};
	}, []);
}
