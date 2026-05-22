import { createClient } from "@/utliz/supabaseClient";
import { Passenger } from "@/types/booking";

const supabase = createClient();

const generatePNR = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pnr = "SKY-";
  for (let i = 0; i < 4; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
};

export const createBooking = async ({
  flightId,
  passenger,
  seatId,
}: {
  flightId: string | undefined;
  seatId: string | undefined;
  passenger: Passenger;
}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in to book");
  if (!flightId) throw new Error("No flight selected");
  if (!seatId) throw new Error("No seat selected");

  const { data: booking, error: bookingError } = await supabase.rpc(
    "reserve_seat",
    {
      p_seat_id: seatId,
      p_flight_id: flightId,
      p_user_id: user.id,
      p_total_price: 0,
      p_pnr_code: generatePNR(),
    }
  );

  if (bookingError) throw bookingError;

  const { data: passengerData, error: passengerError } = await supabase
    .from("passengers")
    .insert({
      booking_id: booking.id,
      full_name: passenger.full_name,
      passport_no: passenger.passport_no,
      nationality: passenger.nationality,
      dob: passenger.dob,
    })
    .select()
    .single();

  if (passengerError) throw passengerError;

  return { booking, passenger: passengerData };
};

export const fetchBooking = async (userId: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      flights (
        origin,
        destination,
        departs_at,
        arrives_at,
        aircraft_type,
        flight_no
      )
    `
    )
    .eq("user_id", userId)
    .order("booked_at", { ascending: false });

  if (error) throw error;

  return data;
};

export const fetchBookingById = async (bookingId: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      flights (
        origin,
        destination,
        departs_at,
        arrives_at,
        aircraft_type,
        flight_no
      )
    `
    )
    .eq("id", bookingId)
    .single();

  if (error) throw error;

  return data;
};

export const cancelBooking = async (bookingId: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const rescheduleBooking = async ({
  bookingId,
  newFlightId,
  feeCharged,
}: {
  bookingId: string;
  newFlightId: string;
  feeCharged: number;
}) => {
  // get current booking to get old flight id
  const { data: currentBooking, error: fetchError } = await supabase
    .from("bookings")
    .select("flight_id")
    .eq("id", bookingId)
    .single();

  if (fetchError) throw fetchError;

  // insert into reschedules table
  const { error: rescheduleError } = await supabase
    .from("reschedules")
    .insert({
      booking_id: bookingId,
      old_flight_id: currentBooking.flight_id,
      new_flight_id: newFlightId,
      fee_charged: feeCharged,
    });

  if (rescheduleError) throw rescheduleError;

  // update booking with new flight
  const { data, error: updateError } = await supabase
    .from("bookings")
    .update({
      flight_id: newFlightId,
      status: "rescheduled",
    })
    .eq("id", bookingId)
    .select()
    .single();

  if (updateError) throw updateError;

  return data;
};