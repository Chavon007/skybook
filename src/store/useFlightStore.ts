import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Flight, SearchQuery } from "../types/flight";
import { Seat } from "@/types/seat";
import { Passenger } from "@/types/booking";

type FlightStore = {
  searchQuery: SearchQuery;
  flights: Flight[];
  seats: Seat[];
  pnrCode: string | null;
  setPnrCode: (pnr: string) => void;
  passengersDetails: Passenger | null;
  setPassengerDetails: (passengers: Passenger) => void;
  selectedFlight: Flight | null;
  setSearchQuery: (query: SearchQuery) => void;
  setFlights: (flights: Flight[]) => void;
  setSelectedFlight: (flight: Flight | null) => void;
  clearFlights: () => void;
  resetStore: () => void;
  selectedSeat: Seat | null;
  setSeat: (seats: Seat[]) => void;
  setSelectedSeat: (seats: Seat | null) => void;
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
      seats: [],
      pnrCode: null,
      passengersDetails: null,
      selectedFlight: null,
      selectedSeat: null,

      setPnrCode: (pnr) => set({ pnrCode: pnr }),
      setPassengerDetails: (passengers) =>
        set({ passengersDetails: passengers }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFlights: (flights) => set({ flights }),
      setSelectedFlight: (flight) => set({ selectedFlight: flight }),
      setSelectedSeat: (seat) => set({ selectedSeat: seat }),
      setSeat: (seats) => set({ seats }),
      clearFlights: () => set({ flights: [] }),
      resetStore: () =>
        set({
          searchQuery: defaultSearchQuery,
          seats: [],
          flights: [],
          selectedFlight: null,
          selectedSeat: null,
          passengersDetails: null,
          pnrCode: null,
        }),
    }),
    {
      name: "flight-store",
      partialize: (state) => ({
        searchQuery: state.searchQuery,
      }),
    },
  ),
);
