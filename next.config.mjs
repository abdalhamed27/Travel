/** @type {import('next').NextConfig} */
const nextConfig = {
    // experimental: {
  //   serverActions: true,
  // },
  images:{
    domains: ["itedzhjldhgymjsvcofz.supabase.co","i.imgur.com"],
  },
 // Adding the following lines for static exporting
//  output: 'export',
      typescript: {
        ignoreBuildErrors: true, // This will ignore TypeScript errors during the build
      },

      
};

export default nextConfig;
