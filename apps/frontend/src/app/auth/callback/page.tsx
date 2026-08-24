"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const next = new URLSearchParams(window.location.search).get("next") || "/";

      if (accessToken && refreshToken) {
        router.push(next);
      }
    }
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <p className="text-[var(--mute)]">Memproses autentikasi...</p>
    </div>
  );
}
