"use client";
import { useFlightStore } from "@/store/useFlightStore";
import useSeat from "@/hooks/seathook";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

function ConfirmedBooking() {
  const router = useRouter();
  const { selectedSeat } = useSeat();
  const { selectedFlight, passengersDetails, pnrCode } = useFlightStore();

  return (
    <div
      className="relative min-h-screen bg-center bg-cover"
      style={{ backgroundImage: "url(/bg1.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center text-center mb-6"
        >
          <div className="bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-6 w-full">
            <IoIosCheckmarkCircleOutline className="text-4xl text-amber-100 mx-auto mb-2" />

            <h3 className="text-2xl font-serif font-bold text-amber-100">
              Booking confirmed!
            </h3>

            <p className="text-xs font-mono text-amber-100/60 mt-1">
              A receipt has been sent to your email
            </p>
          </div>
        </motion.div>

        {/* PNR CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-6 text-center mb-6"
        >
          <small className="text-xs font-mono text-amber-100/50">
            Your PNR code
          </small>

          <h3 className="text-3xl font-serif font-bold text-amber-100 tracking-widest mt-1">
            {pnrCode ?? "-"}
          </h3>

          <p className="text-xs font-mono text-amber-100/40 mt-2">
            Show this at the airport check-in counter
          </p>
        </motion.div>

        {/* DETAILS CARD */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-6"
        >
          <h3 className="text-sm font-serif font-bold text-amber-100 mb-4">
            Flight Summary
          </h3>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-xs text-amber-100/50 font-mono">
                Flight
              </span>
              <span className="text-xs text-amber-100 font-mono">
                {selectedFlight?.aircraft_type}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-xs text-amber-100/50 font-mono">Route</span>
              <span className="text-xs text-amber-100 font-mono">
                {selectedFlight?.origin} → {selectedFlight?.destination}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-xs text-amber-100/50 font-mono">Date</span>
              <span className="text-xs text-amber-100 font-mono">
                {selectedFlight?.departs_at}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-xs text-amber-100/50 font-mono">Seat</span>
              <span className="text-xs text-amber-100 font-mono">
                {selectedSeat?.seat_number}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-xs text-amber-100/50 font-mono">
                Passenger
              </span>
              <span className="text-xs text-amber-100 font-mono">
                {passengersDetails?.full_name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-xs text-amber-100/50 font-mono">Class</span>
              <span className="text-xs text-amber-100 font-mono capitalize">
                {selectedSeat?.class}
              </span>
            </div>

            <div className="flex justify-between border-t border-amber-100/10 pt-3 mt-2">
              <span className="text-sm text-amber-100/70 font-mono">
                Total Paid
              </span>
              <span className="text-lg text-amber-100 font-serif font-bold">
                ₦{selectedFlight?.base_price?.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* BUTTON */}
        <button
          onClick={() => router.push("/booking")}
          className="mt-6 px-6 py-3 bg-amber-100 text-black font-serif font-semibold rounded-xl hover:bg-amber-300 transition"
        >
          My bookings →
        </button>
      </div>
    </div>
  );
}

export default ConfirmedBooking;
