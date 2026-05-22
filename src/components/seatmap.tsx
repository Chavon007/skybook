"use client";
import useSeat from "@/hooks/seathook";
import { useFlightStore } from "@/store/useFlightStore";
import { Seat } from "@/types/seat";
import { MdFlightTakeoff } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const legend = [
  { title: "Available", bg: "bg-green-900/40 border-green-500/30" },
  { title: "Taken", bg: "bg-red-900/40 border-red-500/30" },
  { title: "Selected", bg: "bg-amber-400/40 border-amber-400" },
];

function SeatMap() {
  const {
    seats,
    loading,
    error,
    selectedSeat,
    handleContinue,
    handleSeatSelection,
  } = useSeat();

  const { selectedFlight } = useFlightStore();
  const router = useRouter();

  const firstClass = seats.filter((s) => s.class === "first");
  const business = seats.filter((s) => s.class === "business");
  const economy = seats.filter((s) => s.class === "economy");

  const getSeatStyle = (seat: Seat) => {
    if (selectedSeat?.id === seat.id)
      return "bg-amber-400/40 border-amber-400 text-amber-100 scale-110 shadow-lg shadow-amber-400/20";
    if (!seat.is_available)
      return "bg-red-900/40 border-red-500/30 text-red-300 cursor-not-allowed opacity-50";
    return "bg-green-900/40 border-green-500/30 text-green-300 hover:bg-amber-100/20 hover:border-amber-100/40 hover:scale-105 transition-all";
  };

  const renderSeats = (seatList: Seat[]) => (
    <div className="flex flex-wrap gap-2 justify-center">
      {seatList.map((seat) => (
        <button
          key={seat.id}
          onClick={() => handleSeatSelection(seat)}
          disabled={!seat.is_available}
          title={`${seat.class} · ${seat.is_available ? `+₦${seat.extra_fee.toLocaleString()}` : "Taken"}`}
          className={`w-9 h-9 rounded-md border text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all duration-200 ${getSeatStyle(seat)}`}
        >
          {seat.seat_number}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen">
      

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
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

        {/* FLIGHT INFO BANNER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2"
        >
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-100">
              Select your seat
            </h2>
            {selectedFlight && (
              <p className="text-sm text-amber-100/60 font-mono">
                {selectedFlight.flight_no} · {selectedFlight.origin} →{" "}
                {selectedFlight.destination}
              </p>
            )}
          </div>
          {/* LEGEND */}
          <div className="flex items-center gap-4 flex-wrap">
            {legend.map((l, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border ${l.bg}`} />
                <span className="text-xs text-amber-100/60 font-mono">
                  {l.title}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* MAIN LAYOUT — SEAT MAP LEFT, PANEL RIGHT */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT — SEAT MAP */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex-1 bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-5 overflow-y-auto max-h-[600px]"
          >
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-amber-100/60 font-mono animate-pulse">
                  Loading seats...
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* PLANE NOSE */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <MdFlightTakeoff className="text-amber-100/30 text-3xl rotate-90" />
                    <p className="text-xs text-amber-100/20 font-mono">FRONT</p>
                  </div>
                </div>

                {firstClass.length > 0 && (
                  <div>
                    <p className="text-xs text-amber-100/40 font-mono text-center mb-3 tracking-widest uppercase">
                      — First Class —
                    </p>
                    {renderSeats(firstClass)}
                  </div>
                )}

                <div className="border-t border-dashed border-amber-100/10" />

                {business.length > 0 && (
                  <div>
                    <p className="text-xs text-amber-100/40 font-mono text-center mb-3 tracking-widest uppercase">
                      — Business —
                    </p>
                    {renderSeats(business)}
                  </div>
                )}

                <div className="border-t border-dashed border-amber-100/10" />

                {economy.length > 0 && (
                  <div>
                    <p className="text-xs text-amber-100/40 font-mono text-center mb-3 tracking-widest uppercase">
                      — Economy —
                    </p>
                    {renderSeats(economy)}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* RIGHT — SELECTION PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:w-72 flex flex-col gap-4"
          >
            {/* SEAT DETAILS CARD */}
            <div className="bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-5 flex-1">
              <h3 className="text-amber-100 font-serif font-bold text-base mb-4">
                Seat Details
              </h3>

              <AnimatePresence mode="wait">
                {selectedSeat ? (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    {/* BIG SEAT NUMBER */}
                    <div className="flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center">
                        <span className="text-3xl font-bold font-serif text-amber-100">
                          {selectedSeat.seat_number}
                        </span>
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center border-b border-amber-100/10 pb-2">
                        <span className="text-xs text-amber-100/50 font-mono">
                          Class
                        </span>
                        <span className="text-sm text-amber-100 font-serif capitalize font-semibold">
                          {selectedSeat.class}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-amber-100/10 pb-2">
                        <span className="text-xs text-amber-100/50 font-mono">
                          Seat No.
                        </span>
                        <span className="text-sm text-amber-100 font-serif font-semibold">
                          {selectedSeat.seat_number}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-amber-100/10 pb-2">
                        <span className="text-xs text-amber-100/50 font-mono">
                          Extra fee
                        </span>
                        <span className="text-sm text-amber-100 font-serif font-semibold">
                          +₦{selectedSeat.extra_fee.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-amber-100/50 font-mono">
                          Status
                        </span>
                        <span className="text-xs bg-green-900/40 text-green-300 border border-green-500/20 px-2 py-0.5 rounded-full font-mono">
                          Available
                        </span>
                      </div>
                    </div>

                    {/* FLIGHT TOTAL */}
                    {selectedFlight && (
                      <div className="bg-amber-100/5 border border-amber-100/10 rounded-xl p-3 mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-amber-100/50 font-mono">
                            Base fare
                          </span>
                          <span className="text-xs text-amber-100 font-mono">
                            ₦{selectedFlight.base_price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-amber-100/50 font-mono">
                            Seat upgrade
                          </span>
                          <span className="text-xs text-amber-100 font-mono">
                            +₦{selectedSeat.extra_fee.toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t border-amber-100/10 pt-2 flex justify-between items-center">
                          <span className="text-xs text-amber-100/70 font-mono font-semibold">
                            Subtotal
                          </span>
                          <span className="text-sm text-amber-100 font-serif font-bold">
                            ₦
                            {(
                              selectedFlight.base_price + selectedSeat.extra_fee
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-3 py-10 text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-amber-100/5 border border-amber-100/10 flex items-center justify-center">
                      <span className="text-2xl">💺</span>
                    </div>
                    <p className="text-amber-100/40 font-mono text-xs">
                      Click a seat on the map to see details
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CONTINUE BUTTON */}
            <button
              onClick={handleContinue}
              disabled={!selectedSeat}
              className={`w-full py-3 rounded-xl font-serif font-semibold text-sm transition cursor-pointer ${
                selectedSeat
                  ? "bg-amber-100 text-black hover:bg-amber-300"
                  : "bg-amber-100/10 text-amber-100/30 cursor-not-allowed border border-amber-100/10"
              }`}
            >
              {selectedSeat ? "Continue →" : "Select a seat to continue"}
            </button>

            {error && (
              <p className="text-red-400 text-xs font-mono text-center">
                {error}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default SeatMap;
