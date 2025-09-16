import React from "react";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout";

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
      </Routes>
    </>
  );
};

export default App;
