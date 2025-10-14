import React from "react";
import { Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <GarageProvider>
      <div className="z-10">
        <ToastContainer />
        {/** Navbar */}
        <Navbar />
        {/** Routes */}
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
        </Routes>
      </div>
    </GarageProvider>
  );
};

export default App;
