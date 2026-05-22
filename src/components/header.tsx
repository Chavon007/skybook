"use client";

import { FaUser } from "react-icons/fa";
import { MdFlightTakeoff } from "react-icons/md";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Header() {
  const pathName = usePathname();

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 text-amber-100">
     
      <section className="flex items-center gap-2">
        <MdFlightTakeoff className="text-2xl text-amber-200" />
        <h2 className="text-xl font-serif font-bold">SkyBook</h2>
      </section>

  
      <section className="flex items-center gap-6 text-sm font-mono">
        <Link
          href="/flight"
          className={`cursor-pointer font-sans transition hover:text-amber-300 ${
            pathName === "/flight"
              ? "text-amber-300 font-bold"
              : "text-amber-100"
          }`}
        >
          Search
        </Link>

        <Link
          href="/booking"
          className={`cursor-pointer font-sans transition hover:text-amber-300 ${
            pathName === "/booking"
              ? "text-amber-300 font-bold"
              : "text-amber-100"
          }`}
        >
          My bookings
        </Link>

        <FaUser className="text-amber-200 text-lg  hover:text-amber-300 transition" />
      </section>
    </nav>
  );
}

export default Header;
