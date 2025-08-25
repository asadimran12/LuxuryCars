import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Applayout from "./components/Layout/Applayout";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Car from "./pages/Cars";
import Cardetails from "./pages/Cardetails";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";

import Admin from "./pages/Admin";
import Adminqueries from "./pages/Adminqueries";
import Adminusers from "./pages/Adminusers";
import Adminbookings from "./pages/Adminbookings";
import Admincars from "./pages/Admincars";
import AdminUserDetails from "./pages/Adminuserdetails";
import { useAuth } from "./components/Context/Authcontent";
import AdminCarDetails from "./pages/Admincardetails";
import Adminaddnewcar from "./pages/Adminaddnewcar";
import AdminReplyingMessage from "./pages/AdminReplyingMessage";
import Forgetpassword from "./pages/Forgetpassword";
import VerifyOTP from "./pages/VerifyOTP";
import Newpassword from "./pages/Newpassword";
import Booking from "./pages/Booking";
import Driver from "./pages/Driver";
import Driversignup from "./pages/Driversignup";
import Driverlogin from "./pages/Driverlogin";
import DriverProfile from "./pages/Driverprofile";
import Driverbookings from "./pages/Driverbookings";

// ✅ Redirect Component Based on Role
const RedirectBasedOnRole = () => {
  const { role } = useAuth();

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  } else if (role === "user") {
    return <Navigate to="/home" replace />;
  } else if (role === "driver") {
    return <Navigate to="/driver" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

// ✅ Admin Routes
const getAdminRoutes = () => [
  { path: "/admin", element: <Admin /> },
  { path: "/admin/users", element: <Adminusers /> },
  { path: "/admin/bookings", element: <Adminbookings /> },
  { path: "/admin/cars", element: <Admincars /> },
  { path: "/admin/addcars", element: <Adminaddnewcar /> },
  { path: "/admin/queries", element: <Adminqueries /> },
  { path: "/admin/users/:id", element: <AdminUserDetails /> },
  { path: "/admin/cars/:id", element: <AdminCarDetails /> },
  { path: "/admin/replyingquerry/:id", element: <AdminReplyingMessage /> },
];

// ✅ User Routes
const getUserRoutes = () => [
  {
    path: "/home",
    element: <Applayout />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/home/services", element: <Services /> },
      { path: "/home/cars", element: <Car /> },
      { path: "/home/carsdetails/:id", element: <Cardetails /> },
      { path: "/home/blogsposts", element: <Blog /> },
      { path: "/home/contactus", element: <Contact /> },
      { path: "/home/profile", element: <Profile /> },
      { path: "/home/booking/:id", element: <Booking /> },
    ],
  },
];

// ✅ Driver Routes (separate path: `/driver`)
const getDriverRoutes = () => [
  {
    path: "/driver",
    element: <Applayout />,
    children: [
      { index: true, element: <Driver /> }, // default page: /driver
      { path: "login", element: <Driverlogin /> }, // /driver/login
      { path: "signup", element: <Driversignup /> }, // /driver/signup
      { path: "profile", element: <DriverProfile /> }, // /driver/signup
      { path: "boking", element: <Driverbookings /> }, // /driver/signup
    ],
  },
];

const App = () => {
  const { role } = useAuth();

  const router = createBrowserRouter([
    { path: "/", element: <RedirectBasedOnRole /> },
    { path: "/login", element: <Login /> },
    { path: "/forgetpassword", element: <Forgetpassword /> },
    { path: "/verifyotp", element: <VerifyOTP /> },
    { path: "/newpassword", element: <Newpassword /> },
    { path: "/register", element: <Register /> },

    ...(role === "admin" ? getAdminRoutes() : getUserRoutes()),

    ...getDriverRoutes(),
  ]);

  return <RouterProvider router={router} />;
};

export default App;
