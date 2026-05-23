"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { MdFlightTakeoff } from "react-icons/md";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  useEffect(() => {
    // redirect to login after animation finishes
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden bg-center bg-cover"
      style={{ backgroundImage: "url(/bg1.jpg)" }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* plane flying across */}
      <motion.div
        initial={{ x: "-100vw", y: "20vh", opacity: 0 }}
        animate={{ x: "100vw", y: "-20vh", opacity: 1 }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className="absolute text-amber-100 text-6xl z-10"
      >
        <MdFlightTakeoff />
      </motion.div>

      {/* logo fades in then out */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
        transition={{ duration: 3, times: [0, 0.3, 0.7, 1] }}
        className="relative z-10 flex flex-col items-center gap-3"
      >
        <h1 className="text-5xl font-serif font-bold text-amber-100 tracking-widest">
          SkyBook
        </h1>
        <p className="text-amber-100/70 font-mono text-sm tracking-widest">
          your flights, your way
        </p>
      </motion.div>
    </div>
  );
}
export default Home;
