"use client";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function useProtectedRoute() {
  const { session, loading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
    }
  }, [session, loading,  router]);

  return { session, loading };
}

export default useProtectedRoute;