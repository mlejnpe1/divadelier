import React from "react";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout";
import ContactPage from "./pages/ContactPage";
import DrZdivPage from "./pages/DrZdivPage";
import DivanPage from "./pages/DivanPage";
import VVVPage from "./pages/VVVPage";
import NotFoundPage from "./pages/NotFoundPage";
import EshopPage from "./pages/EshopPage";
import HistoryPage from "./pages/HistoryPage";
import CoursesPage from "./pages/CoursesPage";

const App = () => {
  const routes = [
    { path: "/", element: <LandingPage /> },
    { path: "/kontakt", element: <ContactPage /> },
    { path: "/drZdiv", element: <DrZdivPage /> },
    { path: "/divan", element: <DivanPage /> },
    { path: "/vvv", element: <VVVPage /> },
    { path: "/eshop", element: <EshopPage /> },
    { path: "/historie", element: <HistoryPage /> },
    { path: "/kurzy", element: <CoursesPage /> },
  ];

  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={<Layout>{element}</Layout>} />
      ))}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
