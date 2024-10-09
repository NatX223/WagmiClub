import * as Yup from "yup";

/**
 * Validation schema for the Medal form.
 */
export const MEDAL_SCHEMA = Yup.object().shape({
	/**
	 * Image field validation.
	 * Required field.
	 */
	image: Yup.mixed().required("Image is required"),

	/**
	 * Title field validation.
	 * Required field.
	 */
	title: Yup.string().required("Title is required"),

	/**
	 * Type field validation.
	 * Required field.
	 */
	type: Yup.string().required("Type is required"),

	/**
	 * Address field validation.
	 * Required field.
	 * Must be a valid Ethereum address.
	 */
	address: Yup.string()
		.required("Address is required")
		.matches(/^(0x)?[a-fA-F0-9]{40}$/, "Invalid or incomplete address"),

	/**
	 * Metrics field validation.
	 * Required field.
	 */
	metrics: Yup.string().required("Metrics is required"),

	/**
	 * Medals field validation.
	 * Required field.
	 * Must be a number.
	 * Maximum allowed value is 75.
	 */
	medals: Yup.number()
		.required("Number of medals to create is required")
		.max(75, "Maximum number of medals to create is 75"),

	/**
	 * AdditionalInfo field validation.
	 * Optional field.
	 */
	additionalInfo: Yup.string().required("Medal description is required"),
});
