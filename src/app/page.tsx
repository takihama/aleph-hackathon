"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page
    router.replace("/home");
  }, [router]);

  // Return empty div while redirecting
  return <div></div>;
}
