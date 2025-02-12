/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["placekitten.com"],
  },
  output: "export",
  assetPrefix: process.env.NODE_ENV === "production" ? "/{Ai2-Doc-Generator}" : "",
  basePath: process.env.NODE_ENV === "production" ? "/{Ai2-Doc-Generator}" : "",
}

module.exports = nextConfig

// Replace {repo-name} with your actual GitHub repository name

