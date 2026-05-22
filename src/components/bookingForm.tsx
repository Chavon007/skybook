"use client";
import useBooking from "@/hooks/bookinghook";
import { useFlightStore } from "@/store/useFlightStore";
import { MdFlightTakeoff } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function BookingDetails() {
  const { formData, setFormData, loading, error, handleBooking } = useBooking();
  const { selectedFlight, selectedSeat } = useFlightStore();
  const router = useRouter();

  const totalPrice =
    (selectedFlight?.base_price ?? 0) + (selectedSeat?.extra_fee ?? 0);

  return (
    <div
      className="relative min-h-screen bg-center bg-cover"
      style={{ backgroundImage: "url(/bg1.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-8">

        {/* TOP NAV */}
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

        {/* STEP INDICATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          {["Flight", "Seat", "Details", "Confirm"].map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono ${
                  index === 2
                    ? "bg-amber-100 text-black font-semibold"
                    : index < 2
                    ? "bg-amber-100/20 text-amber-100/60 line-through"
                    : "bg-amber-100/5 text-amber-100/30 border border-amber-100/10"
                }`}
              >
                {step}
              </div>
              {index < 3 && (
                <span className="text-amber-100/20 text-xs">→</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT — PASSENGER FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex-1"
          >
            <div className="bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-6">
              <h2 className="text-lg font-serif font-bold text-amber-100 mb-6">
                Passenger Details
              </h2>

              <form onSubmit={handleBooking} className="flex flex-col gap-4">
                {/* FULL NAME */}
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-amber-100/60 font-mono">
                    Full Name
                  </span>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="p-2.5 rounded-lg bg-black/40 border border-amber-100/20 text-white outline-none font-mono text-sm focus:border-amber-100/50 transition"
                  />
                </label>

                {/* PASSPORT NUMBER */}
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-amber-100/60 font-mono">
                    Passport Number
                  </span>
                  <input
                    type="text"
                    value={formData.passport_no}
                    onChange={(e) =>
                      setFormData({ ...formData, passport_no: e.target.value })
                    }
                    placeholder="A00000000"
                    className="p-2.5 rounded-lg bg-black/40 border border-amber-100/20 text-white outline-none font-mono text-sm focus:border-amber-100/50 transition"
                  />
                </label>

                {/* NATIONALITY + DOB */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-amber-100/60 font-mono">
                      Nationality
                    </span>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nationality: e.target.value,
                        })
                      }
                      placeholder="Nigerian"
                      className="p-2.5 rounded-lg bg-black/40 border border-amber-100/20 text-white outline-none font-mono text-sm focus:border-amber-100/50 transition"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-amber-100/60 font-mono">
                      Date of Birth
                    </span>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      className="p-2.5 rounded-lg bg-black/40 border border-amber-100/20 text-white outline-none font-mono text-sm focus:border-amber-100/50 transition"
                    />
                  </label>
                </div>

                {error && (
                  <p className="text-red-400 text-xs font-mono">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-100 text-black font-serif font-semibold hover:bg-amber-300 transition cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Booking..." : "Confirm Booking →"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* RIGHT — BOOKING SUMMARY */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:w-80 flex flex-col gap-4"
          >
            {/* FLIGHT SUMMARY */}
            <div className="bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-5">
              <h3 className="text-sm font-serif font-bold text-amber-100 mb-4">
                Booking Summary
              </h3>

              {selectedFlight && (
                <div className="flex flex-col gap-3">
                  {/* ROUTE */}
                  <div className="flex items-center justify-center gap-3 py-3 border-b border-amber-100/10">
                    <div className="text-center">
                      <p className="text-xl font-bold font-serif text-amber-100">
                        {selectedFlight.origin}
                      </p>
                      <p className="text-xs text-amber-100/40 font-mono">
                        Origin
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-amber-100/30">
                      <MdFlightTakeoff className="text-lg" />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold font-serif text-amber-100">
                        {selectedFlight.destination}
                      </p>
                      <p className="text-xs text-amber-100/40 font-mono">
                        Destination
                      </p>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-amber-100/50 font-mono">
                        Flight
                      </span>
                      <span className="text-xs text-amber-100 font-mono">
                        {selectedFlight.flight_no}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-amber-100/50 font-mono">
                        Aircraft
                      </span>
                      <span className="text-xs text-amber-100 font-mono">
                        {selectedFlight.aircraft_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-amber-100/50 font-mono">
                        Departure
                      </span>
                      <span className="text-xs text-amber-100 font-mono">
                        {new Date(selectedFlight.departs_at).toLocaleString(
                          "en-NG",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </span>
                    </div>
                    {selectedSeat && (
                      <div className="flex justify-between">
                        <span className="text-xs text-amber-100/50 font-mono">
                          Seat
                        </span>
                        <span className="text-xs text-amber-100 font-mono capitalize">
                          {selectedSeat.seat_number} · {selectedSeat.class}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PRICE BREAKDOWN */}
            <div className="bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-5">
              <h3 className="text-sm font-serif font-bold text-amber-100 mb-4">
                Price Breakdown
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-xs text-amber-100/50 font-mono">
                    Base fare
                  </span>
                  <span className="text-xs text-amber-100 font-mono">
                    ₦{selectedFlight?.base_price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-amber-100/50 font-mono">
                    Seat upgrade
                  </span>
                  <span className="text-xs text-amber-100 font-mono">
                    +₦{selectedSeat?.extra_fee.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-amber-100/10 pt-2 mt-1 flex justify-between">
                  <span className="text-sm text-amber-100/70 font-mono font-semibold">
                    Total
                  </span>
                  <span className="text-lg text-amber-100 font-serif font-bold">
                    ₦{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;