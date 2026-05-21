"use client";
import { useState } from "react";
import { authProp } from "@/types/auth";
import { signupSupabase, loginSupabse } from "@/services/authsupabse";
import { useUserStore } from "../store/useUserStore";

function useAuth() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<authProp>({
    fullName: "",
    password: "",
    confirmpassword: "",
    email: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { setSession } = useUserStore();

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
        window.location.href = "/home";
      }, 2000);
    } catch (err) {
      setError("Can't login now");
    } finally {
      setLoading(false);
    }
  };




  return {login, signup, loading, error, success, setFormData, formData };
}

export default useAuth;
