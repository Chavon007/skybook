import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Flight, SearchQuery } from "../types/flight";

type FlightStore = {
  searchQuery: SearchQuery;
  flights: Flight[];                        
  selectedFlight: Flight | null;           
  setSearchQuery: (query: SearchQuery) => void;
  setFlights: (flights: Flight[]) => void;  
  setSelectedFlight: (flight: Flight | null) => void;
  clearFlights: () => void;
  resetStore: () => void;
};

const defaultSearchQuery: SearchQuery = {
  origin: "",
  destination: "",
  date: "",
  passengers: 1,
  flightClass: "economy",
};

export const useFlightStore = create<FlightStore>()(
  persist(
    (set) => ({
      searchQuery: defaultSearchQuery,
      flights: [],
      selectedFlight: null,

      setSearchQuery: (query) => set({ searchQuery: query }),
      setFlights: (flights) => set({ flights }),
      setSelectedFlight: (flight) => set({ selectedFlight: flight }),
      clearFlights: () => set({ flights: [] }),
      resetStore: () => set({
        searchQuery: defaultSearchQuery,
        flights: [],
        selectedFlight: null,   
      }),
    }),
    {
      name: "flight-store",
      partialize: (state) => ({
        searchQuery: state.searchQuery,
      }),
    }
  )
);  