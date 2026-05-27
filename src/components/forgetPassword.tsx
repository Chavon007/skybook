"use client";

import useAuth from "@/hooks/auth";
import { MdFlightTakeoff } from "react-icons/md";
import { motion } from "framer-motion";
import Link from "next/link";

function ForgetPassword() {
  const { passwordReset, loading, error, formData, setFormData, success } =
    useAuth();

  return (
    <div
      className="relative flex flex-col justify-center items-center min-h-screen p-4 bg-center bg-cover"
      style={{ backgroundImage: "url(/bg1.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col justify-center items-center h-auto border border-amber-100/30 rounded-2xl w-full max-w-[400px] p-3 mx-auto bg-black/20 backdrop-blur-lg"
      >
        {/* HEADER */}
        <section className="flex p-2 justify-center items-center gap-4">
          <div className="text-3xl text-amber-100">
            <MdFlightTakeoff />
          </div>
          <h2 className="text-2xl font-serif font-bold text-amber-100">
            Skybook
          </h2>
        </section>

        <form onSubmit={passwordReset} className="flex flex-col gap-2 w-full">
          <section className="p-2">
            <h3 className="text-base font-extrabold font-sans text-amber-50">
              Forgot password?
            </h3>
            <p className="text-sm font-light font-mono text-amber-100">
              Enter your email and we'll send you a reset link
            </p>
          </section>

          <section className="flex flex-col gap-2 px-2">
            <label className="flex font-serif flex-col gap-1 text-amber-100 text-sm">
              <span>Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                className="p-2 rounded-md bg-black/40 border border-amber-100/30 text-white outline-none w-full"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="p-2 rounded-md text-sm bg-amber-100 font-serif hover:bg-amber-300 cursor-pointer text-black font-semibold"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}

            <div className="text-amber-100 text-sm font-sans font-light text-center pb-2">
              <h5>
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="cursor-pointer font-mono font-medium text-amber-300 underline text-xs"
                >
                  Back to login
                </Link>
              </h5>
            </div>
          </section>
        </form>
      </motion.div>
    </div>
  );
}

export default ForgetPassword;