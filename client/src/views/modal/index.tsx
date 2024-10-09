"use client";

import { FC, ReactNode } from "react";
import { CloseMenu } from "@/assets/icons";
import "./index.scss";

interface props {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

export const Modal: FC<props> = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<section className={`modal`}>
			<div className="modal__wrapper">
				<button
					className="modal__close"
					onClick={() => {
						onClose();
					}}
				>
					<span>
						<CloseMenu />
					</span>
				</button>

				<div className="modal__content">{children}</div>
			</div>
		</section>
	);
};
