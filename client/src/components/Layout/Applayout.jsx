import React from "react";
import Header from "../UI/Header";
import { Outlet } from "react-router-dom";
import Footer from "../UI/Footer";
import DriverHeader from "../UI/DriverHeader";
import DriverFooter from "../UI/DriverFooter";

const Applayout = () => {
  const isDriver = location.pathname.startsWith("/driver");

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {isDriver ? <DriverHeader /> : <Header />}
        <main className="flex-grow">
          <Outlet />
        </main>
        {isDriver ? <DriverFooter /> : <Footer />}
      </div>
    </>
  );
};

export default Applayout;
