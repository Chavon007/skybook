"use client";
import { createBooking, fetchBooking } from "@/services/bookingsupabase";
import { useFlightStore } from "@/store/useFlightStore";
import { Passenger } from "@/types/booking";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Bookings } from "@/types/booking";
function useBooking() {
  const router = useRouter();
  const { session } = useUserStore();

  const {
    selectedFlight,
    selectedSeat,
    passengersDetails,
    setPassengerDetails,
    setPnrCode,
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
  const [getBookings, setgetBookings] = useState<Bookings[]>([]);
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
      setPnrCode(data.booking.p_pnr_code);
      setPassengerDetails(data.passenger);
      router.push("/booking/confirmed");
    } catch (err) {
      setError("Can't book now");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user.id) return;
    const handleFetchBookings = async () => {
      setLoading(true);

      try {
        const data = await fetchBooking(session.user.id);
        setgetBookings(data);
      } catch (err: any) {
        setError(err.message || "Failed to get bookings");
      } finally {
        setLoading(false);
      }
    };
    handleFetchBookings();
  }, []);
  return {
    formData,
    getBookings,
    setFormData,
    loading,
    error,
    handleBooking,
    passengersDetails,
  };
}

export default useBooking;
