import React from "react";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout";
import ContactPage from "./pages/ContactPage";
import DrZdivPage from "./pages/DrZdivPage";
import DivanPage from "./pages/DivanPage";
import VVVPage from "./pages/VVVPage";
import NotFoundPage from "./pages/NotFoundPage";

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
        <Route
          path='/vvv'
          element={
            <Layout>
              <VVVPage />
            </Layout>
          }
        />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
