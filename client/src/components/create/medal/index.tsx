import { FC, FocusEvent } from "react";
import {
	SelectField,
	TextField,
	TextAreaField,
	NumberField,
	TimeStamp,
} from "@/components";
import { MEDAL_TYPE, WINNING_METRICS } from "@/assets/data";
import "./index.scss";

interface props {
	group: string;
	errors: {
		title?: string;
		type?: string;
		address?: string;
		metrics?: string;
		validator?: string;
		additionalInfo?: string;
		medals?: string;
	};
	touched: {
		title?: boolean;
		type?: boolean;
		address?: boolean;
		metrics?: boolean;
		validator?: boolean;
		additionalInfo?: boolean;
		medals?: boolean;
	};
	formData: {
		title: string;
		address: string;
		validator: string;
		medals: string;
		additionalInfo: string;
		startDate: Date;
		endDate: Date | null;
		working: boolean;
	};
	handleBlur: (event: FocusEvent<any>) => void;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean,
	) => void;
	handleFormChange: (event: any) => void;
}

const FormField: FC<props> = ({
	group,
	errors,
	touched,
	formData,
	handleBlur,
	setFieldValue,
	handleFormChange,
}) => {
	const {
		title,
		address,
		medals,
		additionalInfo,
		startDate,
		endDate,
		working,
	} = formData;

	return (
		<>
			{/* Medal Title Field */}
			<TextField
				id="title"
				group={group}
				label="Medal Title"
				value={title}
				touched={touched.title}
				onBlur={handleBlur}
				error={errors.title}
				edit={false}
				onChange={handleFormChange}
			/>

			{/* Medal Type Dropdown */}
			<SelectField
				id="type"
				group={group}
				label="Medal Type"
				options={MEDAL_TYPE}
				edit={false}
				onChange={handleFormChange}
				setFieldValue={setFieldValue}
				error={errors.type}
				touched={touched.type}
			/>

			{/* Contract Address Field */}
			<TextField
				id="address"
				group={group}
				label="Contract Address/NFT Name"
				value={address}
				touched={touched.address}
				onBlur={handleBlur}
				error={errors.address}
				edit={true}
				placeholder="0x636h821nb"
				onChange={handleFormChange}
			/>

			{/* Winning Metrics Dropdown */}
			<SelectField
				id="metrics"
				group={group}
				label="Eligibility Metrics"
				options={WINNING_METRICS}
				edit={false}
				onChange={handleFormChange}
				setFieldValue={setFieldValue}
				error={errors.metrics}
				touched={touched.metrics}
			/>

			{/* Prompts the user to enter the number of medals they want to create */}
			<NumberField
				id="medals"
				group={group}
				label="How many medals do you want to create"
				value={medals}
				touched={touched.medals}
				onBlur={handleBlur}
				error={errors.medals}
				edit={true}
				placeholder="maximum of 75"
				setFieldValue={setFieldValue}
			/>

			{/* Timestamp component for start and end dates */}
			<TimeStamp
				group={group}
				startDate={startDate}
				endDate={endDate}
				working={working}
				handleBlur={handleBlur}
				handleFormChange={handleFormChange}
				errors={errors}
				touched={touched}
				label="Medal minting duration"
				placeholder="Endless minting"
				setFieldValue={setFieldValue}
			/>

			{/* Additional Information Textarea */}
			<TextAreaField
				id="additionalInfo"
				group={group}
				label="Medal Description"
				value={additionalInfo}
				touched={touched.additionalInfo}
				onBlur={handleBlur}
				error={errors.additionalInfo}
				onChange={handleFormChange}
			/>
		</>
	);
};

export { FormField as MedalForm };
