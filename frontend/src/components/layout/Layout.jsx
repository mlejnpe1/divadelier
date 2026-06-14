import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieConsentBanner from "../cookies/CookieConsentBanner";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">{children}</main>
      <Footer />
      <CookieConsentBanner />
    </>
  );
};

export default Layout;
