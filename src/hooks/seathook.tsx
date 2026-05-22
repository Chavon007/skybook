import { flightSeat } from "@/services/seatsupabase";
import { useFlightStore } from "@/store/useFlightStore";
import { Seat } from "@/types/seat";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function useSeat() {
  const { seats, selectedSeat, setSeat, setSelectedSeat, selectedFlight } =
    useFlightStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!selectedFlight) return;

    const loadseat = async () => {
      setLoading(true);

      try {
        const data = await flightSeat(selectedFlight.id);
        setSeat(data);
      } catch (err: any) {
        setError(err.message || "Can't select a seat now");
      } finally {
        setLoading(false);
      }
    };

    loadseat();
  }, [selectedFlight]);

  const handleSeatSelection = (seat: Seat) => {
    if (!seat.is_available) {
      setError("This seat is not available");
      return;
    }
    setSelectedSeat(seat);
    setError("");
  };

  const handleContinue = () => {
    if (!selectedFlight) {
      setError("Please select a seat first");
      return;
    }

    router.push("/booking/details");
  };
  return {
    seats,
    loading,
    error,
    selectedSeat,
    handleSeatSelection,
    handleContinue,
  };
}

export default useSeat;
