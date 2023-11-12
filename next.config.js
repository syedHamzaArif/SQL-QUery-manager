/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["gravatar.com", "s.gravatar.com"],
  },

  async redirects() {
     return [
       {
         source: "/join",
         destination: "https://join.slack.com/t/ai-query/shared_invite/zt-1ogvgi8uo-nE2QXksbv4iWLXwFNUEDZg",
         permanent: false,
         basePath: false
       },
     ];
  },

  // async redirects() {
  //   return [
  //     {
  //       source: "/success",
  //       destination: "/dashboard",
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
