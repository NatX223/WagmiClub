"use client";

import { FC, FocusEvent, useEffect, useState } from "react";
import {
	PERSONAL_ACCOUNT_OPTIONS,
	ORGANIZATION_ACCOUNT_OPTIONS,
} from "@/assets/data";
import { SelectField, TextField, TextAreaField } from "@/components";
import "./index.scss";

interface props {
	errors: {
		name?: string;
		username?: string;
		bio?: string;
		occupation?: string;
	};
	touched: {
		name?: boolean;
		username?: boolean;
		bio?: boolean;
		occupation?: boolean;
	};
	formData: {
		name: string;
		username: string;
		bio: string;
		occupation: string;
	};
	activeTab: string;
	handleBlur: (event: FocusEvent<any>) => void;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean,
	) => void;
	handleFormChange: (event: any) => void;
}

export const Details: FC<props> = ({
	errors,
	touched,
	formData,
	activeTab,
	handleBlur,
	setFieldValue,
	handleFormChange,
}) => {
	const group = "details";
	const { name, username, bio } = formData;
	const [options, setOptions] = useState<any>(PERSONAL_ACCOUNT_OPTIONS);
	const occupationOptions = options;

	useEffect(() => {
		switch (activeTab) {
			case "personal":
				setOptions(PERSONAL_ACCOUNT_OPTIONS);
				break;
			case "organisation":
				setOptions(ORGANIZATION_ACCOUNT_OPTIONS);
				break;
			default:
				setOptions(null);
				break;
		}
	}, [activeTab]);
	return (
		<>
			{/* Name Text Field */}
			<TextField
				id="name"
				group={group}
				label="Enter Name"
				value={name}
				touched={touched.name}
				onBlur={handleBlur}
				error={errors.name}
				edit={false}
				onChange={handleFormChange}
			/>

			{/* Username Text Field */}
			<TextField
				id="username"
				group={group}
				label="Enter Username"
				value={username}
				touched={touched.username}
				onBlur={handleBlur}
				error={errors.username}
				edit={false}
				onChange={handleFormChange}
			/>

			{/* Bio Textarea Field */}
			<TextAreaField
				id="bio"
				group={group}
				label="Bio"
				value={bio}
				touched={touched.bio}
				onBlur={handleBlur}
				error={errors.bio}
				onChange={handleFormChange}
			/>

			{/* Occupation Select Field */}
			<SelectField
				id="occupation"
				group={group}
				label="What Describes You Best?"
				options={occupationOptions}
				edit={false}
				onChange={handleFormChange}
				setFieldValue={setFieldValue}
				error={errors.occupation}
				touched={touched.occupation}
			/>
		</>
	);
};
