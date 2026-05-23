"use client";
import { createClient } from "@/utliz/supabaseClient";
import { flightSeat } from "@/services/seatsupabase";
import { useFlightStore } from "@/store/useFlightStore";
import { Seat } from "@/types/seat";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function useSeat() {
  const {
    seats,
    selectedSeat,
    setSeat,
    setSelectedSeat,
    selectedFlight,
    searchQuery,
  } = useFlightStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!selectedFlight) return;

    const loadSeat = async () => {
      setLoading(true);
      try {
        const data = await flightSeat(selectedFlight.id);
        setSeat(data);
      } catch (err: any) {
        setError(err.message || "Can't load seats now");
      } finally {
        setLoading(false);
      }
    };

    loadSeat();

    // Realtime subscription
    const supabase = createClient();
    const channel = supabase
      .channel("seats-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "seats",
          filter: `flight_id=eq.${selectedFlight.id}`,
        },
        (payload) => {
          // update seat availability in store
          setSeat(
            seats.map((seat) =>
              seat.id === payload.new.id
                ? { ...seat, is_available: payload.new.is_available }
                : seat,
            ),
          );

          // deselect seat if taken by someone else
          const isSelected = selectedSeat.some(
            (seat) => seat.id === payload.new.id,
          );
          if (isSelected && !payload.new.is_available) {
            setSelectedSeat(
              selectedSeat.filter((seat) => seat.id !== payload.new.id),
            );
            setError(
              `Sorry! Seat ${payload.new.seat_number} was just taken by someone else. Please select another seat.`,
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedFlight]);

  const handleSeatSelection = (seat: Seat) => {
    if (!seat.is_available) {
      setError("This seat is not available");
      return;
    }

    // deselect if already selected
    const alreadySelected = selectedSeat.find((s) => s.id === seat.id);
    if (alreadySelected) {
      setSelectedSeat(selectedSeat.filter((s) => s.id !== seat.id));
      setError("");
      return;
    }

    // check max seats
    if (selectedSeat.length >= searchQuery.passengers) {
      setError(`You can only select ${searchQuery.passengers} seat(s)`);
      return;
    }

    setSelectedSeat([...selectedSeat, seat]);
    setError("");
  };

  const handleContinue = () => {
 

    if (selectedSeat.length === 0) {
      setError("Please select a seat first");
      return;
    }
    if (selectedSeat.length < searchQuery.passengers) {
      setError(`Please select ${searchQuery.passengers} seat(s)`);
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
