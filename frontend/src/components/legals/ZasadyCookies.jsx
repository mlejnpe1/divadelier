import React from "react";
import LegalPage from "./LegalPage";
import { legalDocuments } from "./legalContent";

const ZasadyCookies = () => {
  return <LegalPage {...legalDocuments.zasadyCookies} />;
};

export default ZasadyCookies;
