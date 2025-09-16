import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className='bg-red-100 min-h-screen'>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
