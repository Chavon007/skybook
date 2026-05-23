-- RPC function for seat reservation
CREATE OR REPLACE FUNCTION reserve_seat(
  p_seat_id UUID,
  p_flight_id UUID,
  p_user_id UUID,
  p_total_price NUMERIC,
  p_pnr_code TEXT
)
RETURNS bookings AS $$
DECLARE
  v_booking bookings;
BEGIN
  PERFORM id FROM seats
  WHERE id = p_seat_id
  AND flight_id = p_flight_id
  AND is_available = TRUE
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Seat is no longer available';
  END IF;

  UPDATE seats SET is_available = FALSE
  WHERE id = p_seat_id;

  INSERT INTO bookings (user_id, flight_id, seat_id, total_price, pnr_code)
  VALUES (p_user_id, p_flight_id, p_seat_id, p_total_price, p_pnr_code)
  RETURNING * INTO v_booking;

  RETURN v_booking;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to block cancellations within 2 hours
CREATE OR REPLACE FUNCTION check_cancellation_time()
RETURNS TRIGGER AS $$
DECLARE
  v_departs_at TIMESTAMPTZ;
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    SELECT departs_at INTO v_departs_at
    FROM flights
    WHERE id = NEW.flight_id;

    IF v_departs_at - NOW() < INTERVAL '2 hours' THEN
      RAISE EXCEPTION 'Cancellations within 2 hours of departure are not allowed';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_cancellation_window
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION check_cancellation_time();