"use client";

import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/** Props for the useFetch hook. */
interface FetchProps {
	/** The URL to fetch data from. */
	url: string;
	/** Optional request configuration for the Axios request. */
	options?: AxiosRequestConfig;
}

/** Result object structure returned by the useFetch hook. */
interface FetchResult<T> {
	/** The fetched data. */
	data: T | null;
	/** A boolean indicating whether the data is being fetched. */
	loading: boolean;
	/** An error object containing details about any errors occurred during fetching. */
	error: Error | null;
}

/**
 * Custom hook for fetching data asynchronously.
 * @param {FetchProps} props - The props containing the URL and optional request options.
 * @returns {FetchResult<T>} The fetched data, loading state, and potential errors.
 * @template T - The type of data being fetched.
 */
export const useFetch = <T>({ url, options }: FetchProps): FetchResult<T> => {
	/** States to store data, loading state, and potential errors */
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		/** Function to fetch data asynchronously */
		const fetchData = async () => {
			try {
				/** Send a GET request to the specified URL with optional request options */
				const response: AxiosResponse<T> = await axios.get(
					url,
					options,
				);
				/** Update data state with the response data */
				setData(response.data);
				/**  Set loading state to false as the data fetching is complete */
				setLoading(false);
			} catch (error) {
				/** Handle errors */
				console.error("Error during fetch:", error);

				if (axios.isAxiosError(error)) {
					/** Handle network errors (e.g., no internet connection) */
					setError(
						new Error("Network error. Please try again later."),
					);
				} else {
					/** Handle other types of errors */
					setError(
						error instanceof Error
							? error
							: new Error("An unknown error occurred."),
					);
				}
			}
		};

		/** Call the fetchData function when the component mounts or when URL/options change */
		fetchData();
	}, [url, options]);

	/** Return the data, loading state, and potential errors */
	return { data, loading, error };
};
