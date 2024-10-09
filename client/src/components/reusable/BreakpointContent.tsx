import React from "react";

export const BreakpointText = ({ text }: { text: string }) => (
	<div
		style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			flexDirection: "column",
			gap: "5rem",
			width: "100%",
			height: "100vh",
			fontSize: "3rem",
			fontFamily: "monospace",
			paddingInline: "1rem",
		}}
	>
		<span>
			<b>wagmi</b>
			<b
				style={{
					color: "#94F2A3",
				}}
			>
				club
			</b>
		</span>
		<span
			style={{
				paddingInline: "5rem",
				textAlign: "center",
			}}
		>
			{text}
		</span>
	</div>
);
