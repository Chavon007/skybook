"use client";
import useBooking from "@/hooks/bookinghook";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { searchFlight } from "@/services/flightsupabse";
import { MdFlightTakeoff } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { motion } from "framer-motion";

function ReschedulePage() {
  const { id } = useParams();
  const router = useRouter();
  const { handleReschedule, reschedulingId, error, getBookings } = useBooking();

  const [availableFlights, setAvailableFlights] = useState<any[]>([]);
  const [selectedNewFlight, setSelectedNewFlight] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const currentBooking = getBookings.find((b) => b.id === id);

  useEffect(() => {
    if (!currentBooking) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await searchFlight({
          origin: currentBooking.flights.origin,
          destination: currentBooking.flights.destination,
          date: new Date(currentBooking.flights.departs_at)
            .toISOString()
            .split("T")[0],
          passengers: 1,
          flightClass: "economy",
        });
        const filtered = data.filter(
          (f: any) => f.id !== currentBooking.flight_id
        );
        setAvailableFlights(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentBooking]);

  const feeCharged =
    selectedNewFlight && currentBooking
      ? Math.max(0, selectedNewFlight.base_price - currentBooking.total_price)
      : 0;

  const handleConfirm = async () => {
    if (!selectedNewFlight || !id) return;
    await handleReschedule({
      bookingId: id as string,
      newFlightId: selectedNewFlight.id,
      feeCharged,
    });
    router.push("/booking");
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-NG", { dateStyle: "medium" });

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">

      {/* PAGE TITLE */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-amber-100 border border-amber-100/30 rounded-lg px-3 py-1.5 text-sm font-mono hover:bg-amber-100/10 transition cursor-pointer"
        >
          <IoIosArrowRoundBack className="text-xl" /> Back
        </button>
        <div>
          <h2 className="text-xl font-serif font-bold text-amber-100">
            Reschedule Booking
          </h2>
          <p className="text-xs text-amber-100/50 font-mono">
            Choose a new flight on the same route
          </p>
        </div>
      </motion.div>

      {/* CURRENT BOOKING */}
      {currentBooking && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-5 mb-6"
        >
          <p className="text-xs text-amber-100/40 font-mono mb-3">
            Current booking
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-bold text-amber-100">
                {currentBooking.flights.origin} →{" "}
                {currentBooking.flights.destination}
              </h3>
              <p className="text-xs text-amber-100/50 font-mono mt-1">
                {formatTime(currentBooking.flights.departs_at)} ·{" "}
                {formatDate(currentBooking.flights.departs_at)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-amber-100/40 font-mono">Total paid</p>
              <p className="text-lg font-serif font-bold text-amber-100">
                ₦{currentBooking.total_price?.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* AVAILABLE FLIGHTS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <p className="text-xs text-amber-100/50 font-mono mb-3">
          Available flights
        </p>

        {loading ? (
          <p className="text-amber-100/60 font-mono text-sm animate-pulse">
            Loading flights...
          </p>
        ) : availableFlights.length === 0 ? (
          <div className="bg-black/30 backdrop-blur-lg border border-amber-100/20 rounded-2xl p-6 text-center">
            <p className="text-amber-100/60 font-mono text-sm">
              No alternative flights available on this route
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {availableFlights.map((f, index) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => setSelectedNewFlight(f)}
                className={`bg-black/30 backdrop-blur-lg rounded-2xl p-5 cursor-pointer transition border ${
                  selectedNewFlight?.id === f.id
                    ? "border-amber-400 bg-amber-100/5"
                    : "border-amber-100/20 hover:border-amber-100/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-amber-100">
                      <span className="text-lg font-bold font-serif">
                        {formatTime(f.departs_at)}
                      </span>
                      <div className="flex flex-col items-center text-xs text-amber-100/40 font-mono">
                        <MdFlightTakeoff className="text-sm" />
                      </div>
                      <span className="text-lg font-bold font-serif">
                        {formatTime(f.arrives_at)}
                      </span>
                    </div>
                    <p className="text-xs text-amber-100/50 font-mono">
                      {f.flight_no} · {f.aircraft_type}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-serif font-bold text-amber-100">
                      ₦{f.base_price?.toLocaleString()}
                    </p>
                    {f.base_price > (currentBooking?.total_price ?? 0) ? (
                      <p className="text-xs text-red-300 font-mono mt-1">
                        +₦
                        {(
                          f.base_price - (currentBooking?.total_price ?? 0)
                        ).toLocaleString()}{" "}
                        fee
                      </p>
                    ) : (
                      <p className="text-xs text-green-300 font-mono mt-1">
                        No extra fee
                      </p>
                    )}
                  </div>
                </div>

                {selectedNewFlight?.id === f.id && (
                  <div className="mt-3 pt-3 border-t border-amber-100/10">
                    <span className="text-xs bg-amber-100/10 text-amber-300 border border-amber-100/20 px-3 py-1 rounded-full font-mono">
                      Selected
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* FEE NOTICE */}
      {selectedNewFlight && feeCharged > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4"
        >
          <p className="text-yellow-300 text-xs font-mono">
            ⚠️ A reschedule fee of ₦{feeCharged.toLocaleString()} will be
            charged for this change.
          </p>
        </motion.div>
      )}

      {error && (
        <p className="text-red-400 text-xs font-mono text-center mt-4">
          {error}
        </p>
      )}

      {/* CONFIRM BUTTON */}
      <button
        onClick={handleConfirm}
        disabled={!selectedNewFlight || reschedulingId === id}
        className={`w-full mt-6 py-3 rounded-xl font-serif font-semibold text-sm transition ${
          selectedNewFlight
            ? "bg-amber-100 text-black hover:bg-amber-300 cursor-pointer"
            : "bg-amber-100/10 text-amber-100/30 cursor-not-allowed border border-amber-100/10"
        }`}
      >
        {reschedulingId === id ? "Rescheduling..." : "Confirm Reschedule →"}
      </button>
    </div>
  );
}

export default ReschedulePage;