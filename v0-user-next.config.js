/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["placekitten.com"],
  },
  output: "export",
  assetPrefix: process.env.NODE_ENV === "production" ? "/{repo-name}" : "",
  basePath: process.env.NODE_ENV === "production" ? "/{repo-name}" : "",
}

module.exports = nextConfig

// Replace {repo-name} with your actual GitHub repository name

