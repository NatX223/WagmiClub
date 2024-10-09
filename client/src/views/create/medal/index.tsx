import { useFormik } from "formik";
import { MEDAL_SCHEMA, DEPLOYMENT_CHAINS } from "@/assets/data";
import { ImageUpload, MedalForm, SelectField } from "@/components";
import { createMedal, medalContractAddress } from "@/utils/app.mjs";
import { useWriteContract } from 'wagmi';
import "./index.scss";

export const Medal = ({ group }: { group: string }) => {
	const initialValues = {
		image: null,
		title: "",
		type: "",
		address: "",
		metrics: "",
		medals: "0",
		validator: "",
		deployChain: "Base",
		additionalInfo: "",
		endDate: null,
		startDate: new Date(),
		working: false,
	};

	const { writeContract } = useWriteContract();
	const abi = [
		{
			"inputs": [],
			"name": "createMedal",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		  },
		  {
			"inputs": [
			  {
				"internalType": "address[]",
				"name": "receivers",
				"type": "address[]"
			  },
			  {
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			  }
			],
			"name": "batchMint",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		  },
	] as const;

	const {
		errors,
		values,
		touched,
		handleBlur,
		handleChange,
		handleSubmit,
		setFieldValue,
	} = useFormik({
		validationSchema: MEDAL_SCHEMA,
		initialValues,
		onSubmit: async (values) => {
			console.log("Formik data:", values);
			// Handle form submission logic here (e.g., API call)
			try {
				await createMedal(values);
				writeContract(
					{ 
					  address: medalContractAddress, 
					  abi, 
					  functionName: "createMedal", 
					  args: [], 
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
				autoComplete="off"
				onSubmit={handleSubmit}
				className={`${group}__form`}
			>
				<SelectField
					id="deployChain"
					group={`${group}__chain`}
					label="chain"
					options={DEPLOYMENT_CHAINS}
					edit={false}
					onChange={handleChange}
					setFieldValue={setFieldValue}
					error={errors.deployChain}
					touched={touched.deployChain}
					selectedValue="Base"
				/>

				{/* File Upload component */}
				<ImageUpload
					group={group}
					errors={errors}
					touched={touched}
					handleBlur={handleBlur}
					onImageChange={(image) => setFieldValue("image", image)}
				/>

				{/* Form Fields component */}
				<MedalForm
					group={group}
					errors={errors}
					touched={touched}
					formData={values}
					handleBlur={handleBlur}
					setFieldValue={setFieldValue}
					handleFormChange={handleChange}
				/>

				{/* Submit Button */}
				<div className={`${group}__submit`}>
					<button
						className={`${group}__submit-button`}
						type="submit"
					>
						<span>Create Medal</span>
					</button>
				</div>
			</form>
		</section>
	);
};
