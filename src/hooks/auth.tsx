"use client";
import { useState } from "react";
import { authProp } from "@/types/auth";
import {
  signupSupabase,
  loginSupabse,
  resetPassword,
  resetPasswordLink,
} from "@/services/authsupabse";
import { useUserStore } from "../store/useUserStore";
import { createClient } from "@/utliz/supabaseClient";
import { useFlightStore } from "@/store/useFlightStore";
import { useRouter } from "next/navigation";
function useAuth() {
  const [loading, setLoading] = useState(false);
  const { resetStore } = useFlightStore();

  const router = useRouter();
  const [formData, setFormData] = useState<authProp>({
    fullName: "",
    password: "",
    confirmpassword: "",
    email: "",
    terms: false,
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { setSession, clearUser } = useUserStore();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmpassword ||
      !formData.terms
    ) {
      setError("please fill all required fields");
      setLoading(false);

      return;
    }
    if (!emailRegex.test(formData.email)) {
      setError("please use a valid email address");
      setLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError("Password can't be less than 8");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmpassword) {
      setError("Confirmed password is different from password");
      setLoading(false);
      return;
    }
    try {
      await signupSupabase(formData);
      setSuccess("Account created successfully");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }
    try {
      const data = await loginSupabse(formData);
      setSession(data.session);
      setSuccess("Login successful");
      setTimeout(() => {
        window.location.href = "/flight";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Can't login now");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearUser();
    resetStore();
    router.push("/login");
  };

  const passwordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.email) {
      setError("Please fill required fields ");
      setLoading(false);
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setError("please use a valid email address");
      setLoading(false);
      return;
    }
    try {
      await resetPasswordLink(formData.email);
      setSuccess("Password reset link sent! Check your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const newPasswordLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.newPassword || !formData.confirmpassword) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }
    if (formData.newPassword !== formData.confirmpassword) {
      setError("New password and confirm password does not match");
      setLoading(false);
      return;
    }
    try {
      await resetPassword(formData.newPassword);
      setSuccess("Password reset successful!");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signup,
    logout,
    loading,
    error,
    success,
    setFormData,
    formData,
    passwordReset,
    newPasswordLink,
  };
}

export default useAuth;
