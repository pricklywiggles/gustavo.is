module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/projects/ponder',
        destination: '/remembering/ponder',
        permanent: true
      }
    ];
  }
};
