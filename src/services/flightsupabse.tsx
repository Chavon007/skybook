"use client";
import { createClient } from "@/utliz/supabaseClient";
import { SearchQuery } from "@/types/flight";

const supabase = createClient();

export const searchFlight = async (query: SearchQuery) => {
  const { data, error } = await supabase
    .from("flights")
    .select("*")
    .ilike("origin", query.origin)
    .ilike("destination", query.destination)
    .eq("status", "scheduled")
    .order("departs_at", { ascending: true });

  if (error) throw error;

  return data;
};
