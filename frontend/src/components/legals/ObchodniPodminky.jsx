import React from "react";
import LegalPage from "./LegalPage";
import { legalDocuments } from "./legalContent";

const ObchodniPodminky = () => {
  return <LegalPage {...legalDocuments.obchodniPodminky} />;
};

export default ObchodniPodminky;
