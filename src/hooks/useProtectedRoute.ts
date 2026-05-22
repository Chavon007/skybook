"use client";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function useProtectedRoute() {
  const { session } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  return { session };
}

export default useProtectedRoute;