"use client";

import { EDIT_SCHEMA } from "@/assets/data";
import { Details, Socials } from "@/components";
import { signUp } from "@/utils/app.mjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi';
import { getBasename, getBasenameTextRecord, getBasenameAvatar, BasenameTextRecordKeys } from "@/utils/basename/resolver";

import "./index.scss";

// interface FormValues {
// 	account: string;
// 	bio: string;
// 	discord: string;
// 	name: string;
// 	occupation: string;
// 	telegram: string;
// 	username: string;
// 	xDotCom: string;
// 	youtube: string;
// }

interface UserDetails {
	basename: string;
	discord: string;
	telegram: string;
	twitter: string;
	url: string;
	avatar: string
}


export const FormField = ({ activeTab }: { activeTab: string }) => {

	const [userDetails, setUserDetails] = useState<UserDetails>({
		basename: "",
		discord: "Discord",
		telegram: "Telegram",
		twitter: "Twitter",
		url: "website",
		avatar: ""
	});

	const account = useAccount();
	const isConnected = account.isConnected;
	const address = account.address || ""; // Fallback to an empty string

	useEffect(() => {
		const fetchBasename = async () => {
		  if (address) {
			const basename = await getBasename(address);
	
			if (basename && basename.endsWith(".base.eth")) {
			  // Fetch additional text records
			  const discord = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Discord) || "";
			  const telegram = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Telegram) || "";
			  const twitter = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Twitter) || "";
			  const url = await getBasenameTextRecord(basename, BasenameTextRecordKeys.Url) || "";
	
			  // Fetch avatar
			  const avatar = await getBasenameAvatar(basename) || "";
	
			  // Set the user details
			  setUserDetails({
				basename: basename,
				discord: discord,
				telegram: telegram,
				twitter: twitter,
				url: url,
				avatar: avatar,
			  });
			}
		  }
		};
	
		fetchBasename();
	  }, [address]); // Re-run when the address changes
	

	// const { address, isConnected } = useWeb3ModalAccount();

	const initialValues = {
		account: activeTab,
		bio: "",
		discord: userDetails.discord,
		name: "",
		occupation: "",
		telegram: userDetails.telegram,
		username: userDetails.basename,
		xDotCom: userDetails.twitter,
		website: userDetails.url,
		youtube: "Youtube",
	};

	const {
		errors,
		values,
		touched,
		handleBlur,
		handleChange,
		handleSubmit,
		setFieldValue,
	} = useFormik({
		validationSchema: EDIT_SCHEMA, // Form validation schema
		initialValues, // Initial form values
		onSubmit: async (values) => {
			try {
				await signUp(values, address);
				console.log(values);
				
			} catch (error) {
				console.log(error);
			}
		},
	});

	console.log({ address, isConnected });

	useEffect(() => {
		setFieldValue("account", activeTab);
	}, [activeTab]);

	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit}
			className="form"
		>
			{/* User details form section */}
			<Details
				errors={errors}
				touched={touched}
				formData={values}
				activeTab={activeTab}
				handleBlur={handleBlur}
				setFieldValue={setFieldValue}
				handleFormChange={handleChange}
			/>

			{/* User socials form section */}
			<Socials
				errors={errors}
				touched={touched}
				formData={values}
				handleBlur={handleBlur}
				setFieldValue={setFieldValue}
				handleFormChange={handleChange}
			/>

			{/* Form submission button */}
			<div className="form__button">
				<button
					type="submit"
					className="form__button-wrapper"
				>
					<span className="form__button-label">Save</span>
				</button>
			</div>
		</form>
	);
};
