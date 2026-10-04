/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  cacheComponents: false,
  cacheHandler: require.resolve('./cache-handler.cjs'),
  cacheMaxMemorySize: 0,
  poweredByHeader: false,
  images: { minimumCacheTTL: 60, maximumDiskCacheSize: 8 * 1024 * 1024 },
};
module.exports = config;
