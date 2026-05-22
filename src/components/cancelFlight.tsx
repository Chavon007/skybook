"use client";
import useBooking from "@/hooks/bookinghook";
import { useParams, useRouter } from "next/navigation";
import { MdFlightTakeoff } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { motion } from "framer-motion";

function CancelPage() {
  const { id } = useParams();
  const router = useRouter();
  const { handleCancel, cancellingId, error, getBookings } = useBooking();

  const currentBooking = getBookings.find((b) => b.id === id);

  const handleConfirmCancel = async () => {
    if (!id) return;
    await handleCancel(id as string);
    router.push("/my-bookings");
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-NG", { dateStyle: "medium" });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className="relative min-h-screen  flex items-center justify-center"
     
    >
    

      <div className="relative z-10 w-full max-w-md mx-auto p-4 md:p-8">

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

        {/* CANCEL CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-2xl p-6"
        >
          {/* ICON */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center text-2xl">
              🗑
            </div>
          </div>

          <h2 className="text-xl font-serif font-bold text-amber-100 text-center mb-1">
            Cancel this booking?
          </h2>
          <p className="text-xs text-amber-100/50 font-mono text-center mb-6">
            This action cannot be undone
          </p>

          {/* BOOKING DETAILS */}
          {currentBooking ? (
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between border-b border-amber-100/10 pb-2">
                <span className="text-xs text-amber-100/40 font-mono">
                  Route
                </span>
                <span className="text-xs text-amber-100 font-mono">
                  {currentBooking.flights.origin} →{" "}
                  {currentBooking.flights.destination}
                </span>
              </div>
              <div className="flex justify-between border-b border-amber-100/10 pb-2">
                <span className="text-xs text-amber-100/40 font-mono">
                  PNR
                </span>
                <span className="text-xs text-amber-100 font-mono">
                  {currentBooking.pnr_code}
                </span>
              </div>
              <div className="flex justify-between border-b border-amber-100/10 pb-2">
                <span className="text-xs text-amber-100/40 font-mono">
                  Flight
                </span>
                <span className="text-xs text-amber-100 font-mono">
                  {currentBooking.flights.flight_no}
                </span>
              </div>
              <div className="flex justify-between border-b border-amber-100/10 pb-2">
                <span className="text-xs text-amber-100/40 font-mono">
                  Departure
                </span>
                <span className="text-xs text-amber-100 font-mono">
                  {formatTime(currentBooking.flights.departs_at)} ·{" "}
                  {formatDate(currentBooking.flights.departs_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-amber-100/40 font-mono">
                  Total paid
                </span>
                <span className="text-xs text-amber-100 font-mono font-bold">
                  ₦{currentBooking.total_price?.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-amber-100/50 font-mono text-sm text-center mb-6">
              Booking not found
            </p>
          )}

          {/* WARNING */}
          <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-3 mb-6">
            <p className="text-red-300 text-xs font-mono">
              ⚠️ Cancellations within 2 hours of departure are not allowed.
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono text-center mb-4">
              {error}
            </p>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 py-2.5 rounded-xl border border-amber-100/20 text-amber-100 font-mono text-sm hover:bg-amber-100/10 transition cursor-pointer"
            >
              Keep booking
            </button>
            <button
              onClick={handleConfirmCancel}
              disabled={cancellingId === id}
              className="flex-1 py-2.5 rounded-xl bg-red-500/80 text-white font-mono text-sm hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {cancellingId === id ? "Cancelling..." : "Yes, cancel"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CancelPage;