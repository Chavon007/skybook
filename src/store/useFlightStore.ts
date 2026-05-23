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
  passengersDetails: Passenger | null;
  selectedFlight: Flight | null;
  selectedSeat: Seat[];

  setPnrCode: (pnr: string) => void;
  setPassengerDetails: (passengers: Passenger) => void;
  setSearchQuery: (query: SearchQuery) => void;
  setFlights: (flights: Flight[]) => void;
  setSelectedFlight: (flight: Flight | null) => void;
  setSeat: (seats: Seat[]) => void;
  setSelectedSeat: (seats: Seat[]) => void;
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
      seats: [],
      pnrCode: null,
      passengersDetails: null,
      selectedFlight: null,
      selectedSeat: [],

      setPnrCode: (pnr) => set({ pnrCode: pnr }),
      setPassengerDetails: (passengers) =>
        set({ passengersDetails: passengers }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFlights: (flights) => set({ flights }),
      setSelectedFlight: (flight) => set({ selectedFlight: flight }),
      setSeat: (seats) => set({ seats }),
      setSelectedSeat: (seats) => set({ selectedSeat: seats }),
      clearFlights: () => set({ flights: [] }),
      resetStore: () =>
        set({
          searchQuery: defaultSearchQuery,
          seats: [],
          flights: [],
          selectedFlight: null,
          selectedSeat: [],
          passengersDetails: null,
          pnrCode: null,
        }),
    }),
    {
      name: "flight-store",
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedFlight: state.selectedFlight,
        selectedSeat: state.selectedSeat,
        pnrCode: state.pnrCode,
        passengersDetails: state.passengersDetails,
      }),
    },
  ),
);
