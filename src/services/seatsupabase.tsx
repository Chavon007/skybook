"use client";

import { createClient } from "@/utliz/supabaseClient";

const supabase = createClient();

export const flightSeat = async (flightId: string) => {
  const { data, error } = await supabase
    .from("seats")
    .select("*")
    .eq("flight_id", flightId)
    .order("seat_number", { ascending: true });

  if (error) throw error;
  return data;
};
