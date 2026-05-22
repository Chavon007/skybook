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
      p_flight_id: seatId,
      p_user_id: user.id,
      p_total_price: 0,
      p_pnr_code: generatePNR(),
    },
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
