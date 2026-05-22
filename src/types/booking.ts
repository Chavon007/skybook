export interface Passenger {
  id: string;
  booking_id: string;
  full_name: string;
  passport_no: string;
  nationality: string;
  dob: string;
  created_at: string;
}

export interface Bookings {
  id: string;
  user_id: string;
  flight_id: string;
  seat_id: string;
  status: "All" | "Confirmed" | "Rescheduled" | "Cancelled";
  booked_at: string;
  total_price: number;
  pnr_code: string;
  created_at: string;

  flights: {
    origin: string;
    destination: string;
    departs_at: string;
    arrives_at: string;
    aircraft_type: string;
    flight_no: string;
  };
}
