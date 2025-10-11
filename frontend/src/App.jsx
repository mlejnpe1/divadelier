import React from "react";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout";
import ContactPage from "./pages/ContactPage";
import DrZdivPage from "./pages/DrZdivPage";
import DivanPage from "./pages/DivanPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path='/kontakt'
          element={
            <Layout>
              <ContactPage />
            </Layout>
          }
        />
        <Route
          path='/drZdiv'
          element={
            <Layout>
              <DrZdivPage />
            </Layout>
          }
        />
        <Route
          path='/divan'
          element={
            <Layout>
              <DivanPage />
            </Layout>
          }
        />
      </Routes>
    </>
  );
};

export default App;
