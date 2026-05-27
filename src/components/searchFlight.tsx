"use client";
import { CiSearch } from "react-icons/ci";
import useSearch from "@/hooks/searchFlight";
import useProtectedRoute from "@/hooks/useProtectedRoute";

const popular = [
  {
    to: "LOS → ABV",
    price: 45000,
  },
  {
    to: "LOS → ENG",
    price: 38000,
  },
];

function Search() {
  const {
    handleSearchFlight,
    loading: searchLoading,
    error,
    setSearchQuery,
    searchQuery,
  } = useSearch();

  const { loading } = useProtectedRoute();
  if (loading) return null;

  return (
    <div className=" min-h-screen flex items-center justify-center p-4 ">
      {/* CARD */}
      <div className="relative w-full max-w-[900px] backdrop-blur-lg bg-black/20 border border-amber-100/30 rounded-2xl p-4 md:p-6">
        {/* HEADER TEXT */}
        <section className="text-center mb-6">
          <h4 className="text-2xl md:text-3xl font-serif text-amber-100 font-bold">
            Where to next?
          </h4>
          <p className="text-sm md:text-base text-amber-100/70 font-mono">
            Search flights across all classes
          </p>
        </section>

        {/* FORM */}
        <form onSubmit={handleSearchFlight} className="flex flex-col gap-4">
          {/* INPUT GRID */}
          <section className="flex flex-col gap-4">
            {/* ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-amber-100 text-sm font-serif">
                <p>From</p>
                <input
                  type="text"
                  value={searchQuery.origin}
                  onChange={(e) =>
                    setSearchQuery({ ...searchQuery, origin: e.target.value })
                  }
                  placeholder="Current city"
                  className="p-2 rounded-md bg-black/40 border border-amber-100/30 text-white outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-amber-100 text-sm font-serif">
                <p>To</p>
                <input
                  type="text"
                  value={searchQuery.destination}
                  onChange={(e) =>
                    setSearchQuery({
                      ...searchQuery,
                      destination: e.target.value,
                    })
                  }
                  placeholder="Destination"
                  className="p-2 rounded-md bg-black/40 border border-amber-100/30 text-white outline-none"
                />
              </label>
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex flex-col gap-1 text-amber-100 text-sm font-serif">
                <p>Date</p>
                <input
                  type="date"
                  value={searchQuery.date}
                  onChange={(e) =>
                    setSearchQuery({ ...searchQuery, date: e.target.value })
                  }
                  className="p-2 rounded-md bg-black/40 border border-amber-100/30 text-white outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-amber-100 text-sm font-serif">
                <p>Passengers</p>
                <input
                  type="number"
                  placeholder="1"
                  value={searchQuery.passengers}
                  onChange={(e) =>
                    setSearchQuery({
                      ...searchQuery,
                      passengers: Number(e.target.value),
                    })
                  }
                  className="p-2 rounded-md bg-black/40 border border-amber-100/30 text-white outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-amber-100 text-sm font-serif">
                <p>Class</p>
                <select
                  value={searchQuery.flightClass}
                  onChange={(e) =>
                    setSearchQuery({
                      ...searchQuery,
                      flightClass: e.target.value,
                    })
                  }
                  className="p-2 rounded-md bg-black/40 border border-amber-100/30 text-white outline-none"
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First</option>
                </select>
              </label>
            </div>
          </section>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={searchLoading}
            className="flex cursor-pointer items-center justify-center gap-2 p-2 rounded-md bg-amber-100 text-black font-semibold font-serif hover:bg-amber-300 transition"
          >
            <CiSearch />
            {searchLoading ? "Searching..." : "Search Flights"}
          </button>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>

        {/* POPULAR ROUTES */}
        <section className="mt-6">
          <h3 className="text-amber-100 font-serif text-lg mb-3">
            Popular routes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {popular.map((r, index) => (
              <div
                key={index}
                className="p-3 rounded-md bg-black/40 border border-amber-100/20 flex justify-between text-amber-100"
              >
                <h5 className="font-mono">{r.to}</h5>
                <p className="text-amber-300 font-semibold">₦{r.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Search;
