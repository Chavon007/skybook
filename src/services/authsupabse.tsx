import { createClient } from "@/utliz/supabaseClient";
import { authProp } from "@/types/auth";

const supabase = createClient();
export const signupSupabase = async (formData: authProp) => {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        fullName: formData.fullName,
        terms: formData.terms,
      },
    },
  });

  if (error) throw error;

  return data;
};

export const loginSupabse = async (formData: authProp) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) throw error;
  return data;
};

export const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.href}/auth/callback`,
    },
  });
  if (error) throw error;
};


