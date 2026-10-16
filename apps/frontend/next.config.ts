import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Removed pages; old links land on Pendaftaran.
  async redirects() {
    return [
      { source: "/curation-process", destination: "/daftar", permanent: true },
      // Sign-up moved into Pendaftaran.
      { source: "/register", destination: "/daftar?program=member&paket=gratis", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cntnjmaiyhpupipkbsff.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
