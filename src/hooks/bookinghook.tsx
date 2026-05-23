"use client";
import {
  createBooking,
  fetchBooking,
  cancelBooking,
  rescheduleBooking,
} from "@/services/bookingsupabase";
import { useFlightStore } from "@/store/useFlightStore";
import { Passenger, Bookings } from "@/types/booking";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

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
  const [getBookings, setGetBookings] = useState<Bookings[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const totalPrice =
    (selectedFlight?.base_price ?? 0) + (selectedSeat?.[0]?.extra_fee ?? 0);

  // create a booking
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
        seatId: selectedSeat?.[0]?.id,
        passenger: formData,
        totalPrice,
      });
      setPnrCode(data.booking.pnr_code);
      setPassengerDetails(data.passenger);
      router.push("/booking/confirmed");
    } catch (err: any) {
      setError(err.message || "Can't book now");
    } finally {
      setLoading(false);
    }
  };

  // fetch all bookings for logged in user
  useEffect(() => {
    if (!session?.user.id) return;
    const handleFetchBookings = async () => {
      setLoading(true);
      try {
        const data = await fetchBooking(session.user.id);
        setGetBookings(data);
      } catch (err: any) {
        setError(err.message || "Failed to get bookings");
      } finally {
        setLoading(false);
      }
    };
    handleFetchBookings();
  }, [session]);

  // cancel a booking
  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    setError("");
    try {
      await cancelBooking(bookingId);
      setGetBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "Cancelled" } : b,
        ),
      );
    } catch (err: any) {
      setError(err.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  // reschedule a booking
  const handleReschedule = async ({
    bookingId,
    newFlightId,
    feeCharged,
  }: {
    bookingId: string;
    newFlightId: string;
    feeCharged: number;
  }) => {
    setReschedulingId(bookingId);
    setError("");
    try {
      await rescheduleBooking({ bookingId, newFlightId, feeCharged });
      setGetBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: "Rescheduled", flight_id: newFlightId }
            : b,
        ),
      );
    } catch (err: any) {
      setError(err.message || "Failed to reschedule booking");
    } finally {
      setReschedulingId(null);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    handleBooking,
    passengersDetails,
    getBookings,
    cancellingId,
    reschedulingId,
    handleCancel,
    handleReschedule,
  };
}

export default useBooking;
