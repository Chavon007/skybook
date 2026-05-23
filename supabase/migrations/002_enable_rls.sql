ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reschedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "flights are viewable by everyone"
ON flights FOR SELECT USING (true);

CREATE POLICY "seats are viewable by everyone"
ON seats FOR SELECT USING (true);

CREATE POLICY "users can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "users can insert own bookings"
ON bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own bookings"
ON bookings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "users can view own passengers"
ON passengers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = passengers.booking_id
    AND bookings.user_id = auth.uid()
  )
);

CREATE POLICY "users can insert own passengers"
ON passengers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = passengers.booking_id
    AND bookings.user_id = auth.uid()
  )
);

CREATE POLICY "users can view own reschedules"
ON reschedules FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = reschedules.booking_id
    AND bookings.user_id = auth.uid()
  )
);

CREATE POLICY "users can insert own reschedules"
ON reschedules FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = reschedules.booking_id
    AND bookings.user_id = auth.uid()
  )
);