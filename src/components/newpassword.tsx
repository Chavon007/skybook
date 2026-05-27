"use client";

import useAuth from "@/hooks/auth";
import { useEffect } from "react";
import { MdFlightTakeoff } from "react-icons/md";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { createClient } from "@/utliz/supabaseClient";
function NewPassword() {
  const { newPasswordLink, loading, formData, setFormData, error, success } =
    useAuth();

  const { setSession } = useUserStore();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setSession(session as any);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
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

        <form onSubmit={newPasswordLink} className="flex flex-col gap-2 w-full">
          <section className="p-2">
            <h3 className="text-base font-extrabold font-sans text-amber-50">
              Create new password
            </h3>
            <p className="text-sm font-light font-mono text-amber-100">
              Enter your new password
            </p>
          </section>

          <section className="flex flex-col gap-2 px-2">
            <label className="flex font-serif flex-col gap-1 text-amber-100 text-sm">
              <span>New password</span>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                placeholder="Enter new password"
                className="p-2 rounded-md bg-black/40 border border-amber-100/30 text-white outline-none w-full"
              />
            </label>
            <label className="flex font-serif flex-col gap-1 text-amber-100 text-sm">
              <span>Confirm password</span>
              <input
                type="password"
                value={formData.confirmpassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmpassword: e.target.value })
                }
                placeholder="Confirm password"
                className="p-2 rounded-md bg-black/40 border border-amber-100/30 text-white outline-none w-full"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="p-2 rounded-md text-sm bg-amber-100 font-serif hover:bg-amber-300 cursor-pointer text-black font-semibold"
            >
              {loading ? "Creating..." : "Create password"}
            </button>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}
          </section>
        </form>
      </motion.div>
    </div>
  );
}

export default NewPassword;
