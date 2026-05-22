import MyBookings from "@/components/mybooking";
import Header from "@/components/header";
function Booking() {
  return (
    <div
      className="relative bg-center bg-cover"
      style={{ backgroundImage: "url(/bg1.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/20" />
      <Header />
      <MyBookings />
    </div>
  );
}
export default Booking;
