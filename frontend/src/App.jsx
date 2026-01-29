import React from "react";
import { Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/layout/Layout";
import ContactPage from "./pages/ContactPage";
import DrZdivPage from "./pages/DrZdivPage";
import DivanPage from "./pages/DivanPage";
import VVVPage from "./pages/VVVPage";
import NotFoundPage from "./pages/NotFoundPage";
import EshopPage from "./pages/EshopPage";
import HistoryPage from "./pages/HistoryPage";
import CoursesPage from "./pages/CoursesPage";
import ActionsPage from "./pages/ActionsPage";
import ActionDetailPage from "./pages/ActionDetailPage";
import LoginPage from "./pages/LoginPage";
import ExhibitionDetailPage from "./pages/ExhibitionDetailPage";
import TVVVPage from "./pages/TVVVPage";

const App = () => {
  const routes = [
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/kontakt", element: <ContactPage /> },
    { path: "/drZdiv", element: <DrZdivPage /> },
    { path: "/divan", element: <DivanPage /> },
    { path: "/vvv", element: <VVVPage /> },
    { path: "/tvvv", element: <TVVVPage /> },
    { path: "/eshop", element: <EshopPage /> },
    { path: "/historie", element: <HistoryPage /> },
    { path: "/kurzy", element: <CoursesPage /> },
    { path: "/akce", element: <ActionsPage /> },
    { path: "/akce/:id", element: <ActionDetailPage /> },
    { path: "/vvv/:id", element: <ExhibitionDetailPage /> },
  ];

  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={<Layout>{element}</Layout>} />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
