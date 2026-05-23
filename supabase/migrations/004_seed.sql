INSERT INTO flights (flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price) VALUES
('AP201', 'Lagos', 'Abuja', '2026-06-12 06:00:00+01', '2026-06-12 07:20:00+01', 'Boeing 737', 'scheduled', 52000),
('AP202', 'Lagos', 'Abuja', '2026-06-12 14:00:00+01', '2026-06-12 15:20:00+01', 'Boeing 737', 'scheduled', 48000),
('AP301', 'Abuja', 'Lagos', '2026-06-12 08:00:00+01', '2026-06-12 09:20:00+01', 'Airbus A320', 'scheduled', 50000),
('AP302', 'Abuja', 'Lagos', '2026-06-12 16:00:00+01', '2026-06-12 17:20:00+01', 'Airbus A320', 'scheduled', 46000),
('AP401', 'Lagos', 'Port Harcourt', '2026-06-12 09:00:00+01', '2026-06-12 10:10:00+01', 'ATR 72', 'scheduled', 38000),
('AP402', 'Lagos', 'Port Harcourt', '2026-06-12 17:00:00+01', '2026-06-12 18:10:00+01', 'ATR 72', 'scheduled', 35000),
('AP501', 'Port Harcourt', 'Lagos', '2026-06-12 11:00:00+01', '2026-06-12 12:10:00+01', 'Boeing 737', 'scheduled', 40000),
('AP502', 'Port Harcourt', 'Lagos', '2026-06-12 19:00:00+01', '2026-06-12 20:10:00+01', 'Boeing 737', 'scheduled', 37000);

DO $$
DECLARE
  v_flight_id UUID;
  flight_nos TEXT[] := ARRAY['AP201','AP202','AP301','AP302','AP401','AP402','AP501','AP502'];
  v_flight_no TEXT;
BEGIN
  FOREACH v_flight_no IN ARRAY flight_nos LOOP
    SELECT id INTO v_flight_id FROM flights WHERE flight_no = v_flight_no;

    INSERT INTO seats (flight_id, seat_number, class, is_available, extra_fee) VALUES
    (v_flight_id, '1A', 'first', TRUE, 15000),
    (v_flight_id, '1C', 'first', TRUE, 15000),
    (v_flight_id, '2A', 'first', TRUE, 15000),
    (v_flight_id, '2C', 'first', TRUE, 15000),
    (v_flight_id, '5A', 'business', TRUE, 8000),
    (v_flight_id, '5B', 'business', TRUE, 8000),
    (v_flight_id, '5D', 'business', TRUE, 8000),
    (v_flight_id, '5E', 'business', TRUE, 8000),
    (v_flight_id, '6A', 'business', TRUE, 8000),
    (v_flight_id, '6B', 'business', TRUE, 8000),
    (v_flight_id, '6D', 'business', TRUE, 8000),
    (v_flight_id, '6E', 'business', TRUE, 8000),
    (v_flight_id, '10A', 'economy', TRUE, 0),
    (v_flight_id, '10B', 'economy', TRUE, 0),
    (v_flight_id, '10C', 'economy', TRUE, 0),
    (v_flight_id, '10D', 'economy', TRUE, 0),
    (v_flight_id, '10E', 'economy', TRUE, 0),
    (v_flight_id, '10F', 'economy', TRUE, 0),
    (v_flight_id, '11A', 'economy', TRUE, 0),
    (v_flight_id, '11B', 'economy', TRUE, 0),
    (v_flight_id, '11C', 'economy', TRUE, 0),
    (v_flight_id, '11D', 'economy', TRUE, 0),
    (v_flight_id, '11E', 'economy', TRUE, 0),
    (v_flight_id, '11F', 'economy', TRUE, 0),
    (v_flight_id, '12A', 'economy', TRUE, 0),
    (v_flight_id, '12B', 'economy', TRUE, 0),
    (v_flight_id, '12C', 'economy', TRUE, 0),
    (v_flight_id, '12D', 'economy', TRUE, 0),
    (v_flight_id, '12E', 'economy', TRUE, 0),
    (v_flight_id, '12F', 'economy', TRUE, 0);

  END LOOP;
END $$;