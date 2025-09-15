import React from "react";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
