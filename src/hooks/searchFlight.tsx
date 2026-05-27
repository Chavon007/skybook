"use client";
import { searchFlight } from "@/services/flightsupabse";
import { useFlightStore } from "@/store/useFlightStore";
import { Flight } from "@/types/flight";
import { useState } from "react";
import { useRouter } from "next/navigation";
function useSearch() {
  const {
    searchQuery,
    flights,

    setSelectedSeat,
    setFlights,
    setSearchQuery,
    setSelectedFlight,
  } = useFlightStore();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearchFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!searchQuery.destination || !searchQuery.origin ) {
      setError("Please fill all search fields");
      setLoading(false);
      return;
    }

    if (searchQuery.destination === searchQuery.origin) {
      setError("Origin and destination cannot be the same");
      setLoading(false);
      return;
    }
    if (searchQuery.passengers < 1) {
      setError("Paasenger can't be less than 1");
      setLoading(false);
      return;
    }

    try {
      const flights = await searchFlight(searchQuery);
      setFlights(flights);
      router.push("/result");
    } catch (err: any) {
      setError(err.message || "Failed to search flights");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAvailableFlight = async (flight: Flight) => {
    setSelectedFlight(flight);
    setSelectedSeat([]);
    router.push("/booking/seat");
  };
  return {
    handleSearchFlight,
    loading,
    error,
    setSearchQuery,
    searchQuery,
    handleFetchAvailableFlight,
    flights,
  };
}

export default useSearch;
