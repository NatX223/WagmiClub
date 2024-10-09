"use client";

import { useState } from "react";
import { REPUTATION_LEADERBOARD } from "@/assets/data";
import { SearchInput } from "@/components";
import "./index.scss";

const Search = ({ onClose }: { onClose: () => void }) => {
	const group = "searchModal";

	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [searchResultsEntered, setSearchResultsEntered] =
		useState<boolean>(false);

	function filterData(data: any[], query: string) {
		if (!query.trim()) return [];

		return data.filter((user) => {
			return user.name.toLowerCase().includes(query.toLowerCase());
		});
	}

	function handleSearch(query: string) {
		const filteredUsers = filterData(REPUTATION_LEADERBOARD, query);

		setSearchResults(filteredUsers);
		setSearchResultsEntered(!!query.trim());
	}

	function RenderResults() {
		return (
			<>
				{searchResults.length > 0 &&
					searchResults.map((user, index) => {
						const { image, name, title } = user;

						return (
							<li
								key={index}
								onClick={onClose}
							>
								<span className={`${group}__image`}>
									<img
										src={image}
										alt="profile__picture"
									/>
								</span>
								<div className={`${group}__displayNames`}>
									<span>{name}</span>
									<span>{title}</span>
								</div>
							</li>
						);
					})}
				{searchResults.length === 0 && searchResultsEntered && (
					<li>No results found for this query</li>
				)}
			</>
		);
	}

	return (
		<section className={`${group}`}>
			<div className={`${group}__wrapper`}>
				<SearchInput
					group={group}
					onSearch={handleSearch}
				/>

				<ul className={`${group}__footer`}>
					<RenderResults />
				</ul>
			</div>
		</section>
	);
};

export { Search as SearchModal };
