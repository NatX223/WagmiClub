import "./index.scss";

const TrustScores = ({ group }: { group: string }) => {
	const data = [
		{
			id: 1,
			value: 80,
			range: "high",
		},
		{
			id: 2,
			value: 60,
			range: "medium",
		},
		{
			id: 3,
			value: 40,
			range: "low",
		},
	];

	return (
		<section className={`${group}`}>
			<div className={`${group}__wrapper`}>
				<h3 className={`${group}__title`}>Trustscore</h3>
				<ul className={`${group}__list`}>
					{data.map((item) => {
						const { id, value, range } = item;

						return (
							<li
								key={id}
								className={`${group}__item`}
							>
								<div>
									<span>{value}%</span>
								</div>
								<span>{range}</span>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
};

export { TrustScores };
