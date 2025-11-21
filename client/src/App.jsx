import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Services from "./Pages/Services";
import { GarageProvider } from "./Contexts/GarageContext";
import "react-toastify/dist/ReactToastify.css";
import ServiceDetails from "./Pages/ServiceDetails";
import Garage_Details from "./Pages/Garage_Details";
import { ToastContainer } from "react-toastify";
import GoDashboard from "./Pages/GoDashboard";
import Layout from "./Components/Layout"
import Customers from "./Pages/Customers";
import Reservations from "./Pages/Reservations";
import MyGarages from "./Pages/MyGarages";
import Mechanics from "./Pages/Mechanics";




const AppContent = () => {

  //hedha bech ena7i el main navbar mel dashboard mta3 el garageOwner
    const location = useLocation();
    const hideNavbar = location.pathname === '/dashboard' || location.pathname === '/mechanics' || location.pathname === '/myGarages'  || location.pathname === '/dashboard/' || location.pathname === '/reservations' || location.pathname === '/customers' || location.pathname === '/customers/';

  return (
    <>
      <ToastContainer />
      {/* Conditionally render Navbar */}
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Service/:id" element={<ServiceDetails />}></Route>
        <Route path="/garage/:id" element={<Garage_Details />}></Route>
        <Route
          path="/Services"
          element={
            <>
              <SignedIn>
                <Services />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/sign-in/*"
          element={<SignIn routing="path" signUpUrl="/sign-up" />}
        />
        <Route
          path="/sign-up/*"
          element={<SignUp routing="path" signInUrl="/sign-in" />}
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <GoDashboard />
            </Layout>
          }
        />
        <Route
          path="/customers"
          element={
            <Layout>
              <Customers />
            </Layout>
          }
        />
        <Route
          path="/reservations"
          element={
            <Layout>
              <Reservations />
            </Layout>
          }
        />
        <Route
          path="/myGarages"
          element={
            <Layout>
              <MyGarages />
            </Layout>
          }
        />
        <Route
          path="/mechanics"
          element={
            <Layout>
              <Mechanics />
            </Layout>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <GarageProvider>
      <div className="z-10">
        <Routes>
          <Route path="*" element={<AppContent />} />
        </Routes>
      </div>
    </GarageProvider>
  );
};

export default App;
