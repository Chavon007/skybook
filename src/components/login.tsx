"use client";
import Link from "next/link";
import useAuth from "@/hooks/auth";
import { MdFlightTakeoff } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { loginWithGoogle } from "@/services/authsupabse";

function LoginForm() {
  const { login, loading, error, success, formData, setFormData } = useAuth();

  return (
    <div>
      <div
        className="relative flex flex-col justify-center items-center min-h-screen p-4 bg-center bg-cover"
        style={{ backgroundImage: "url(/bg1.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        {/* card */}
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

          <form onSubmit={login} className="flex flex-col gap-2 w-full">
            <section className="p-2">
              <h3 className="text-base font-extrabold font-sans text-amber-50">
                Welcome back
              </h3>
              <p className="text-sm font-light font-mono text-amber-100">
                Sign in to manage your flights
              </p>
            </section>

            <section className="flex flex-col gap-2 px-2">
              {/* EMAIL */}
              <label className="flex font-serif flex-col gap-1 text-amber-100 text-sm">
                <span>Email</span>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="p-2 rounded-md bg-black/40 border border-amber-100/30 text-white outline-none w-full"
                />
              </label>

              {/* PASSWORD */}
              <label className="flex font-serif flex-col gap-1 text-amber-100 text-sm">
                <span>Password</span>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                  className="p-2 rounded-md bg-black/40 border border-amber-100/30 text-white outline-none w-full"
                />
              </label>

              {/* FORGOT PASSWORD */}
              <div className="flex justify-end">
                <Link
                  href="/forget-password"
                  className="text-xs text-amber-300 font-mono underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="p-2 rounded-md text-sm bg-amber-100 font-serif hover:bg-amber-300 cursor-pointer text-black font-semibold"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* DIVIDER */}
              <div className="flex items-center gap-2">
                <div className="flex-1 border-t border-amber-100/30" />
                <span className="text-amber-100/50 text-xs font-mono">or</span>
                <div className="flex-1 border-t border-amber-100/30" />
              </div>

              {/* GOOGLE BUTTON */}
              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex items-center justify-center gap-2 p-2 rounded-md text-sm bg-white/10 border border-amber-100/30 font-serif hover:bg-white/20 cursor-pointer text-amber-100 font-semibold"
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </button>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-green-400 text-sm">{success}</p>}

              <div className="text-amber-100 text-sm font-sans font-light text-center pb-2">
                <h5>
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="cursor-pointer font-mono font-medium text-amber-300 underline text-xs"
                  >
                    Sign up
                  </Link>
                </h5>
              </div>
            </section>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginForm;
