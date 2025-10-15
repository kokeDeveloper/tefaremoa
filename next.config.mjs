import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Next outputFileTracingRoot:", path.resolve(__dirname));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
  // Add the following configuration to serve static files
  staticPageGenerationTimeout: 60,
  outputFileTracingRoot: path.resolve(__dirname),
  outputFileTracingExcludes: {
    '*': ['C:/Users/jorge/**/*'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ttf|otf|eot|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: '/fonts/',
        },
      },
    });
    return config;
  },
};

export default nextConfig;
