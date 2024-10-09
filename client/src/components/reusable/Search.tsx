"use client";

import { ChangeEvent, FC, useEffect, useRef } from "react";
import { Search as SearchIcon } from "@/assets/icons";

interface props {
	group: string;
	onSearch: (query: string) => void;
}

const Search: FC<props> = ({ group, onSearch }) => {
	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		onSearch(event.target.value);
	}

	const placeholderRef = useRef<HTMLInputElement>(null);
	const texts = [
		"Investors",
		"Advisors",
		"Designers",
		"Developers",
		"Creators",
		"Marketers",
		"Founders",
	];
	const speed = 120;

	useEffect(() => {
		let textIndex = 0;
		let charIndex = 0;

		function typewriter() {
			const currentText = texts[textIndex];
			const placeholder = currentText.substring(0, charIndex);
			placeholderRef.current?.setAttribute(
				"placeholder",
				`Search for ${placeholder}`,
			);

			charIndex++;

			if (charIndex <= currentText.length) {
				setTimeout(typewriter, speed);
			} else {
				// Clear the word with a backspace effect before moving to the next text after a delay
				setTimeout(() => {
					backspaceEffect(currentText.length);
				}, 2000);
			}
		}

		function backspaceEffect(index: number) {
			if (index >= 0) {
				setTimeout(() => {
					const placeholder = texts[textIndex].substring(0, index);
					placeholderRef.current?.setAttribute(
						"placeholder",
						`Search for ${placeholder}`,
					);
					backspaceEffect(index - 1);
				}, speed);
			} else {
				// Move to the next text in the array or loop back to the start
				textIndex = (textIndex + 1) % texts.length;

				// Reset charIndex to 0 for the next text
				charIndex = 0;

				// Pause before starting the next text
				setTimeout(typewriter, speed * 2);
			}
		}

		// Start the typewriter effect only on component mount
		if (textIndex === 0 && charIndex === 0) {
			typewriter();
		}
	}, []);

	return (
		<div className={`${group}__header`}>
			<span>
				<SearchIcon />
			</span>

			<input
				type="text"
				placeholder="Search"
				ref={placeholderRef}
				onChange={handleInputChange}
			/>
		</div>
	);
};

export { Search as SearchInput };
