export function truncateWalletAddress(
	address: string,
	maxLength: number = 10,
): string {
	if (!address || address.length <= maxLength) return address;

	const prefixLength = maxLength / 2.5;
	const suffixLength = maxLength - prefixLength;

	const prefix = address.slice(0, prefixLength);
	const suffix = address.slice(-suffixLength);

	return `${prefix}...${suffix}`;
}
