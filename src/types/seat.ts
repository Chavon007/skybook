export interface Seat {
  id: string;
  flight_id: string;
  seat_number: string;
  class: string;
  is_available: boolean;
  extra_fee: number;
  created_at: string;
}
