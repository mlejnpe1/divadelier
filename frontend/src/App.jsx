import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { Analytics } from "@vercel/analytics/react";
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
import RentalPage from "./pages/RentalPage";
import LetAndeluPage from "./pages/LetAndeluPage";
import BackToTop from "./components/layout/BackToTop";
import ScrollToTop from "./utils/ScrollToTop";
import ObchodniPodminky from "./components/legals/ObchodniPodminky";
import ZasadyZpracovaniOsobnichUdaju from "./components/legals/ZasadyZpracovaniOsobnichUdaju";
import ZasadyCookies from "./components/legals/ZasadyCookies";
import MimosoudniReseniSpotrebitelskychSporu from "./components/legals/MimosoudniReseniSpotrebitelskychSporu";

const PAGE_TITLES = [
  { match: /^\/$/, title: "Úvodní stránka" },
  { match: /^\/login\/?$/, title: "Přihlášení" },
  { match: /^\/kontakt\/?$/, title: "Kontakt" },
  { match: /^\/drZdiv\/?$/, title: "Dr. ZDIV" },
  { match: /^\/divan\/?$/, title: "Divan" },
  { match: /^\/vvv\/?$/, title: "Výstavy ve výloze" },
  { match: /^\/tvvv\/?$/, title: "TV VV" },
  { match: /^\/eshop\/?$/, title: "E-shop" },
  { match: /^\/historie\/?$/, title: "Historie" },
  { match: /^\/kurzy\/?$/, title: "Kurzy" },
  { match: /^\/akce\/?$/, title: "Akce" },
  { match: /^\/let-andelu\/?$/, title: "Let andělů" },
  { match: /^\/pronajem\/?$/, title: "Pronájem" },
  { match: /^\/obchodni-podminky\/?$/, title: "Obchodní podmínky" },
  {
    match: /^\/zasady-zpracovani-osobnich-udaju\/?$/,
    title: "Zásady zpracování osobních údajů",
  },
  { match: /^\/zasady-cookies\/?$/, title: "Zásady Cookies" },
  {
    match: /^\/mimosoudni-reseni-spotrebitelskych-sporu\/?$/,
    title: "Mimosoudní řešení spotřebitelských sporů",
  },
  { match: /^\/akce\/[^/]+\/?$/, title: "Detail akce" },
  { match: /^\/vvv\/[^/]+\/?$/, title: "Detail výstavy" },
];

function PageMetadata() {
  const location = useLocation();

  useEffect(() => {
    const matched = PAGE_TITLES.find(({ match }) => match.test(location.pathname));
    const pageTitle = matched?.title || "Stránka nenalezena";
    document.title = `Divadeliér | ${pageTitle}`;
  }, [location.pathname]);

  return null;
}

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
    { path: "/let-andelu", element: <LetAndeluPage /> },
    { path: "/akce/:id", element: <ActionDetailPage /> },
    { path: "/vvv/:id", element: <ExhibitionDetailPage /> },
    { path: "/pronajem", element: <RentalPage /> },
    { path: "/obchodni-podminky", element: <ObchodniPodminky /> },
    {
      path: "/zasady-zpracovani-osobnich-udaju",
      element: <ZasadyZpracovaniOsobnichUdaju />,
    },
    { path: "/zasady-cookies", element: <ZasadyCookies /> },
    {
      path: "/mimosoudni-reseni-spotrebitelskych-sporu",
      element: <MimosoudniReseniSpotrebitelskychSporu />,
    },
  ];

  return (
    <>
      <PageMetadata />
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={<Layout>{element}</Layout>} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Analytics />
      <ScrollToTop />
      <BackToTop showAfter={400} />
    </>
  );
};

export default App;
