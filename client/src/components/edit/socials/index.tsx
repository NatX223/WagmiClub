import { ChangeEvent, FC, FocusEvent } from "react";
import { TextField } from "@/components";
import "./index.scss";

interface props {
	errors: {
		discord?: string;
		telegram?: string;
		xDotCom?: string;
		youtube?: string;
		website?: string;
	};
	touched: {
		discord?: boolean;
		telegram?: boolean;
		xDotCom?: boolean;
		youtube?: boolean;
		website?: boolean;
	};
	formData: {
		discord: string;
		telegram: string;
		xDotCom: string;
		youtube: string;
		website: string;
	};
	handleBlur: (e: FocusEvent<any>) => void;
	handleFormChange: (e: ChangeEvent<any>) => void;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean,
	) => void;
}

export const Socials: FC<props> = ({
	errors,
	touched,
	formData,
	handleBlur,
	handleFormChange,
}) => {
	const { discord, telegram, xDotCom, youtube, website } = formData;
	const group = "socials";

	return (
		<div className={group}>
			{/* Section heading */}
			<h3 className="form__divider">
				Link to your other social accounts (optional)
			</h3>

			{/* Social media input fields */}
			<TextField
				id="xDotCom"
				group={group}
				label="X.com/"
				value={xDotCom}
				touched={touched.xDotCom}
				onBlur={handleBlur}
				error={errors.xDotCom}
				edit={false}
				onChange={handleFormChange}
				placeholder={"username"}
			/>

			<TextField
				id="discord"
				group={group}
				label="discord.com/"
				value={discord}
				touched={touched.discord}
				onBlur={handleBlur}
				error={errors.discord}
				edit={false}
				onChange={handleFormChange}
				placeholder={"username"}
			/>

			<TextField
				id="telegram"
				group={group}
				label="telegram.org/"
				value={telegram}
				touched={touched.telegram}
				onBlur={handleBlur}
				error={errors.telegram}
				edit={false}
				onChange={handleFormChange}
				placeholder={"username"}
			/>

			<TextField
				id="youtube"
				group={group}
				label="youtube.com/"
				value={youtube}
				touched={touched.youtube}
				onBlur={handleBlur}
				error={errors.youtube}
				edit={false}
				onChange={handleFormChange}
				placeholder={"username"}
			/>

			<TextField
				id="website"
				group={group}
				label="my-website.com/"
				value={website}
				touched={touched.website}
				onBlur={handleBlur}
				error={errors.website}
				edit={false}
				onChange={handleFormChange}
			/>
		</div>
	);
};
