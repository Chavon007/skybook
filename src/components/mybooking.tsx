"use client";

import useBooking from "@/hooks/bookinghook";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { MdFlightTakeoff } from "react-icons/md";

const filterOption = [
  { title: "All" },
  { title: "Confirmed" },
  { title: "Rescheduled" },
  { title: "Cancelled" },
];

function MyBookings() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { getBookings, loading } = useBooking();
  const router = useRouter();

  const filteredBookings =
    activeFilter === "All"
      ? getBookings
      : getBookings.filter((b) => b.status === activeFilter);

  return (
    <div className=" min-h-screen ">
      <div className="relative z-10 p-6 md:p-10">
        {/* HEADER (LEFT ALIGNED) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h4 className="text-2xl md:text-3xl font-serif font-bold text-amber-100">
            My Bookings
          </h4>
          <p className="text-xs text-amber-100/50 font-mono mt-1">
            Manage all your flight reservations
          </p>
        </motion.div>

        {/* FILTERS (LEFT ALIGNED ROW) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterOption.map((f) => {
            const isActive = activeFilter === f.title;

            return (
              <button
                key={f.title}
                onClick={() => setActiveFilter(f.title)}
                className={`px-4 py-2 rounded-xl text-xs font-mono border transition ${
                  isActive
                    ? "bg-amber-100 text-black border-amber-100"
                    : "bg-black/30 text-amber-100 border-amber-100/20 hover:bg-black/50"
                }`}
              >
                {f.title}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-amber-100/60 font-mono">Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-4 mt-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-amber-100/5 border border-amber-100/10 flex items-center justify-center">
              <MdFlightTakeoff className="text-4xl text-amber-100/30" />
            </div>
            <div>
              <p className="text-amber-100 font-serif text-lg font-bold mb-1">
                No bookings yet
              </p>
              <p className="text-amber-100/40 font-mono text-xs">
                You have not made any{" "}
                {activeFilter !== "All" ? activeFilter.toLowerCase() : ""}{" "}
                bookings yet
              </p>
            </div>
            <button
              onClick={() => router.push("/flight")}
              className="px-5 py-2.5 rounded-xl bg-amber-100 text-black font-serif font-semibold text-sm hover:bg-amber-300 transition cursor-pointer"
            >
              Search flights →
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="w-full bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-5"
              >
                {/* TOP ROW */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                  <div>
                    <h3 className="text-sm md:text-base font-serif text-amber-100">
                      {book.flights.origin} → {book.flights.destination}
                    </h3>

                    <p className="text-xs text-amber-100/50 font-mono mt-1">
                      Booked: {book.booked_at}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-mono px-3 py-1 rounded-full w-fit ${
                      book.status === "Confirmed"
                        ? "bg-green-500/20 text-green-300"
                        : book.status === "Cancelled"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-yellow-500/20 text-yellow-200"
                    }`}
                  >
                    {book.status}
                  </span>
                </div>

                {/* DETAILS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs font-mono text-amber-100/70">
                  <div>
                    <p className="text-amber-100/40">PNR</p>
                    <p>{book.pnr_code}</p>
                  </div>

                  <div>
                    <p className="text-amber-100/40">Seat</p>
                    <p>{book.seat_id}</p>
                  </div>

                  <div>
                    <p className="text-amber-100/40">Flight</p>
                    <p>{book.flight_id}</p>
                  </div>

                  <div>
                    <p className="text-amber-100/40">Time</p>
                    <p>
                      {book.flights.departs_at} → {book.flights.arrives_at}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-5 justify-start">
                  <button
                    onClick={() =>
                      router.push(`/booking/reschedule/${book.id}`)
                    }
                    className="px-4 py-2 text-xs font-mono rounded-xl bg-amber-100 text-black hover:bg-amber-300 transition"
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={() => router.push(`/booking/cancelled/${book.id}`)}
                    className="px-4 py-2 text-xs font-mono rounded-xl border border-red-400/40 text-red-300 hover:bg-red-500/10 transition"
                  >
                    Cancel
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

export default MyBookings;
