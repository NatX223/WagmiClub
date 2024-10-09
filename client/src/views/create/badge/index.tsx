import { BADGE_SCHEMA } from "@/assets/data";
import { BadgeForm, ImageUpload, Rating } from "@/components";
import { mintBadge, badgeContractAddress } from "@/utils/app.mjs";
import { useFormik } from "formik";
import { useWriteContract, useAccount } from 'wagmi';
import "./index.scss";
import { getConfig } from "@/wagmi";
import { getEnsAddress } from '@wagmi/core'
import { normalize } from 'viem/ens';

export const Badge = ({ group }: { group: string }) => {
	const initialValues = {
		additionalInfo: "",
		description: "",
		endDate: null,
		image: null,
		rating: 0,
		receiver: "",
		startDate: new Date(),
		title: "",
		validator: "",
		working: false,
	};

	const { writeContract } = useWriteContract() 
	const abi = [
		{
			stateMutability: "nonpayable",
			type: "function",
			inputs: [
				{
					internalType: "address",
					name: "owner",
					type: "address",
				},
			],
			name: "mint",
			outputs: [],			
		},
	] as const

	const {
		values,
		handleSubmit,
		setFieldValue,
		handleChange,
		handleBlur,
		errors,
		touched,
	} = useFormik({
		validationSchema: BADGE_SCHEMA,
		initialValues,
		onSubmit: async (values) => {
			console.log("Formik data:", values);
			// Handle form submission logic here (e.g., API call)
			try {
				const account = useAccount();
				const address = account.address || "";
				await mintBadge(values, address);
				writeContract(
					{ 
					  address: badgeContractAddress, 
					  abi, 
					  functionName: "mint", 
					  args: [values.receiver as `0x${string}`], 
					}
				  )
			} catch (error) {
				console.log(error);
			}
		},
	});

	return (
		<section>
			<form
				onSubmit={handleSubmit}
				autoComplete="off"
				className={`${group}__form`}
			>
				{/* Image Upload Component */}
				<ImageUpload
					onImageChange={(image) => setFieldValue("image", image)}
					handleBlur={handleBlur}
					errors={errors}
					touched={touched}
					group="badge"
				/>

				{/* Badge Form Fields */}
				<BadgeForm
					formData={values}
					handleFormChange={handleChange}
					setFieldValue={setFieldValue}
					handleBlur={handleBlur}
					errors={errors}
					touched={touched}
					group="badge"
				/>

				{/* Rating Component */}
				<Rating
					rating={values.rating}
					handleRatingChange={(newRating) =>
						setFieldValue("rating", newRating)
					}
				/>

				{/* Badge Submission Button */}
				<div className="badge__submit">
					<button
						className="badge__submit-button"
						type="submit"
					>
						<span>mint badge</span>
					</button>
				</div>
			</form>
		</section>
	);
};
