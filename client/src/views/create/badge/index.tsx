import { BADGE_SCHEMA } from "@/assets/data";
import { BadgeForm, ImageUpload, Rating } from "@/components";
import { mintBadge, badgeContractAddress } from "@/utils/app.mjs";
import { useFormik } from "formik";
import { useWriteContract, useAccount } from 'wagmi';
// import { base } from "viem/chains";
import { resolveAddress, BASENAME_RESOLVER_ADDRESS } from "thirdweb/extensions/ens";
import { base } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
import "./index.scss";
// import { getConfig } from "@/wagmi";
// import { normalize } from 'viem/ens';

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENTID;

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

	const account = useAccount();
	const userAddress = account.address || "";

	const { writeContract } = useWriteContract();
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
				const receiver = await getAddress(values.receiver);
				await mintBadge(values, userAddress);
				writeContract(
					{ 
					  address: badgeContractAddress, 
					  abi, 
					  functionName: "mint", 
					  args: [receiver], 
					}
				  )
			} catch (error) {
				console.log(error);
			}
		},
	});

	const getAddress = async (recipient: string): Promise<`0x${string}`> => {
		const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(recipient);
		const client = createThirdwebClient({
			clientId: clientId || "",
		});

		if (isValidAddress) {
		  // If the recipient is a valid Ethereum address, return it
		  return recipient as `0x${string}`;
		} else {
		  // Otherwise, resolve the address
		  const address = await resolveAddress({
			client,
			name: recipient,
			resolverAddress: BASENAME_RESOLVER_ADDRESS,
			resolverChain: base,
		  });
		  console.log(clientId, recipient, address, userAddress);		  
		  return address as `0x${string}`;
		}
	  };

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
