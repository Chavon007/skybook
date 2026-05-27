"use client";
import { useEffect } from "react";
import { createClient } from "@/utliz/supabaseClient";
import { useUserStore } from "@/store/useUserStore";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession } = useUserStore();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setSession(session as any);
    });

    // listen for auth change

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session as any);
    });
    return () => subscription.unsubscribe();
  }, [setSession]);
  return <>{children}</>;
}

export default AuthProvider;
