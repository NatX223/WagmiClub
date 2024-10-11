// /** @type {import('next').NextConfig} */
// const nextConfig = {
// 	webpack: (config) => {
// 		config.resolve.fallback = { fs: false, net: false, tls: false };
// 		config.externals.push("pino-pretty", "lokijs", "encoding");
// 		return config;
// 	},
// 	eslint: {
// 		ignoreDuringBuilds: true,
// 	},
// };

// module.exports = nextConfig;

// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	typescript: {
	  ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
	},
	eslint: {
	  ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
	},
	webpack: config => {
	  config.resolve.fallback = { fs: false, net: false, tls: false };
	  config.externals.push("pino-pretty", "lokijs", "encoding");
	  return config;
	},
	// experimental: {
	// 	appDir: true,
	//   },
  };
  
  module.exports = nextConfig;
