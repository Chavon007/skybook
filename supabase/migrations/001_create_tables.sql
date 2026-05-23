CREATE TABLE flights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_no TEXT NOT NULL UNIQUE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departs_at TIMESTAMPTZ NOT NULL,
  arrives_at TIMESTAMPTZ NOT NULL,
  aircraft_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'delayed', 'cancelled', 'completed')),
  base_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  class TEXT NOT NULL CHECK (class IN ('economy', 'business', 'first')),
  is_available BOOLEAN DEFAULT TRUE,
  extra_fee NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(flight_id, seat_number)
);

CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flight_id UUID NOT NULL REFERENCES flights(id),
  seat_id UUID NOT NULL REFERENCES seats(id),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'rescheduled', 'cancelled')),
  booked_at TIMESTAMPTZ DEFAULT NOW(),
  total_price NUMERIC NOT NULL,
  pnr_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE passengers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  passport_no TEXT NOT NULL,
  nationality TEXT NOT NULL,
  dob DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reschedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  old_flight_id UUID NOT NULL REFERENCES flights(id),
  new_flight_id UUID NOT NULL REFERENCES flights(id),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  fee_charged NUMERIC DEFAULT 0
);