"use client";
import useSearch from "@/hooks/searchFlight";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdFlightTakeoff } from "react-icons/md";
import { motion } from "framer-motion";

function FlightResult() {
  const { flights, searchQuery, handleFetchAvailableFlight } = useSearch();
  const router = useRouter();

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = (departs: string, arrives: string) => {
    const diff = new Date(arrives).getTime() - new Date(departs).getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className=" min-h-screen ">
      {/* overlay */}

      <div className="relative z-10 max-w-3xl mx-auto p-4 md:p-8">
        {/* NAVBAR */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <MdFlightTakeoff className="text-amber-100 text-2xl" />
            <span className="text-amber-100 font-serif font-bold text-xl">
              SkyBook
            </span>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-amber-100 border border-amber-100/30 rounded-lg px-3 py-1.5 text-sm font-mono hover:bg-amber-100/10 transition"
          >
            <IoIosArrowRoundBack className="text-xl" /> Back
          </button>
        </motion.div>

        {/* SEARCH SUMMARY */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-100">
              {searchQuery.origin} → {searchQuery.destination}
            </h2>
            <p className="text-sm text-amber-100/60 font-mono mt-1">
              {searchQuery.date} · {searchQuery.passengers} passenger(s) ·{" "}
              <span className="capitalize">{searchQuery.flightClass}</span>
            </p>
          </div>
          {flights.length > 0 && (
            <div className="bg-amber-100/10 border border-amber-100/20 rounded-lg px-4 py-2 text-center">
              <p className="text-amber-100 font-mono text-sm">
                {flights.length} flight{flights.length > 1 ? "s" : ""} found
              </p>
            </div>
          )}
        </motion.div>

        {/* RESULTS */}
        {flights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center gap-6 mt-24 text-center"
          >
            <div className="text-6xl">✈️</div>
            <div>
              <p className="text-amber-100 font-serif text-xl font-bold mb-2">
                No flights found
              </p>
              <p className="text-amber-100/60 font-mono text-sm">
                No flights available for this route and date.
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-lg bg-amber-100 text-black font-semibold font-serif hover:bg-amber-300 transition"
            >
              Search again
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {flights.map((f, index) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-100/40 transition"
              >
                {/* LEFT — ROUTE + DETAILS */}
                <div className="flex flex-col gap-3 flex-1">
                  {/* TIME ROW */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-bold font-serif text-amber-100">
                        {formatTime(f.departs_at)}
                      </p>
                      <p className="text-xs text-amber-100/50 font-serif">
                        {searchQuery.origin}
                      </p>
                    </div>

                    <div className="flex flex-col items-center flex-1 text-amber-100/40">
                      <p className="text-xs font-mono mb-1">
                        {getDuration(f.departs_at, f.arrives_at)}
                      </p>
                      <div className="flex items-center w-full gap-1">
                        <div className="flex-1 border-t border-dashed border-amber-100/30" />
                        <MdFlightTakeoff className="text-amber-100/50 text-sm" />
                        <div className="flex-1 border-t border-dashed border-amber-100/30" />
                      </div>
                      <p className="text-xs font-mono mt-1 text-amber-100/30">
                        Direct
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-bold font-serif text-amber-100">
                        {formatTime(f.arrives_at)}
                      </p>
                      <p className="text-xs text-amber-100/50 font-serif">
                        {searchQuery.destination}
                      </p>
                    </div>
                  </div>

                  {/* DETAILS ROW */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-amber-100/50 font-sans">
                      {f.aircraft_type}
                    </span>
                    <span className="text-amber-100/30">·</span>
                    <span className="text-xs text-amber-100/50 font-sans">
                      {f.flight_no}
                    </span>
                    <span className="text-amber-100/30">·</span>
                    <span
                      className={`capitalize px-2 py-0.5 rounded-full text-xs font-semibold ${
                        f.status === "scheduled"
                          ? "bg-green-900/40 text-green-300 border border-green-500/20"
                          : "bg-red-900/40 text-red-300 border border-red-500/20"
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="hidden md:block w-px h-16 bg-amber-100/10" />

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:min-w-[120px]">
                  <div className="text-right">
                    <h3 className="text-base font-semibold font-mono text-amber-100">
                      ₦{f.base_price.toLocaleString()}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleFetchAvailableFlight(f)}
                    className="px-5 py-2 rounded-lg bg-amber-100 text-black font-semibold font-serif text-sm hover:bg-amber-300 transition cursor-pointer whitespace-nowrap"
                  >
                    Select →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FlightResult;
