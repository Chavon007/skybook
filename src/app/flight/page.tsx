import Search from "@/components/searchFlight";
import Header from "@/components/header";


function SearchFlight() {
  return (
    <div className="relative bg-center bg-cover" style={{ backgroundImage: "url(/bg1.jpg)" }}>
              <div className="absolute inset-0 bg-black/20"/>
         <Header />
      <Search />;
    </div>
  );
}

export default SearchFlight;
