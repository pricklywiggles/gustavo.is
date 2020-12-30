module.exports = {
  async redirects() {
    return [
      {
        source: "/projects/ponder",
        destination: "/remembering/ponder",
        permanent: true
      }
    ];
  }
};
