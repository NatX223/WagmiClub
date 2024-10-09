import React, { ChangeEvent, FC, FocusEvent } from "react";

interface NumberFieldProps {
	group: string;
	id: string;
	edit: boolean;
	label: string;
	error: string | undefined;
	value: string;
	onBlur: (
		event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
	) => void;
	touched: boolean | undefined;
	placeholder?: string;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean,
	) => void;
}

export const NumberField: FC<NumberFieldProps> = ({
	id,
	edit,
	label,
	error,
	group,
	value,
	onBlur,
	touched,
	placeholder,
	setFieldValue,
}) => {
	const showEdit = edit && value === "";

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		// Allow only numeric input
		const numericValue = event.target.value.replace(/\D/g, "");
		setFieldValue(id, numericValue);
	};

	return (
		<div className={`${group}__text-field`}>
			{/* Input Label */}
			<label
				htmlFor={id}
				className={`${group}__text-label`}
			>
				{label}
			</label>

			{/* Input Field and Edit Button */}
			<div className={`${group}__text-wrapper`}>
				<input
					id={id}
					name={id}
					type="text"
					value={value}
					onBlur={onBlur}
					onChange={handleInputChange}
					placeholder={placeholder}
					className={`${group}__text-input input`}
				/>
				{/* Edit Button (visible when in edit mode and input is empty) */}
				{showEdit && (
					<span className={`${group}__text-edit`}>edit</span>
				)}
			</div>

			{/* Error Message (visible when there's an error and field is touched) */}
			{error && touched && (
				<p className={`${group}__text-error`}>{error}</p>
			)}
		</div>
	);
};
