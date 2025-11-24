import React from "react";
import { Outlet, useLocation } from "react-router-dom"; // Import useLocation
import Header from "../UI/Header";
import Footer from "../UI/Footer";
import DriverHeader from "../UI/DriverHeader";
import DriverFooter from "../UI/DriverFooter";
import MobileUserNavbar from "../UI/mobilenavbar";
import MobileDriverNavbar from "../UI/Mobiledrivernavbar";

const Applayout = () => {
  const location = useLocation();
  const isDriver = location.pathname.startsWith("/driver");

  const MobileNavbar = isDriver ? <MobileDriverNavbar /> : <MobileUserNavbar />;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {isDriver ? <DriverHeader /> : <Header />}
        <main className="flex-grow">
          <Outlet />
        </main>
        {isDriver ? <DriverFooter /> : <Footer />}
      </div>

      {/* ⬅️ Add the mobile navbar component here */}
      {MobileNavbar}
    </>
  );
};

export default Applayout;
