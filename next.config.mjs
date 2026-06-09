/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Let Next.js Image component transcode to WebP/AVIF on request and
    // emit srcset variants. Source PNGs in public/ and public/projects/
    // are kept as-is; this only changes what the browser receives.
    unoptimized: false,
  },
  devIndicators: false,
}

export default nextConfig
