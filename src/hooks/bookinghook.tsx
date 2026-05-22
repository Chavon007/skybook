"use client";
import { createBooking } from "@/services/bookingsupabase";
import { useFlightStore } from "@/store/useFlightStore";
import { Passenger } from "@/types/booking";
import { useRouter } from "next/navigation";
import { useState } from "react";

function useBooking() {
  const router = useRouter();
  const {
    selectedFlight,
    selectedSeat,
    passengersDetails,
    setPassengerDetails,
  } = useFlightStore();
  const [formData, setFormData] = useState<Passenger>({
    id: "",
    booking_id: "",
    full_name: "",
    passport_no: "",
    nationality: "",
    dob: "",
    created_at: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !formData.dob ||
      !formData.full_name ||
      !formData.nationality ||
      !formData.passport_no
    ) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const data = await createBooking({
        flightId: selectedFlight?.id,
        seatId: selectedSeat?.id,
        passenger: formData,
      });
      setPassengerDetails(data.passenger);
      router.push("/booking/confirmed");
    } catch (err) {
      setError("Can't book now");
    } finally {
      setLoading(false);
    }
  };
  return {
    formData,
    setFormData,
    loading,
    error,
    handleBooking,
    passengersDetails,
  };
}

export default useBooking;
