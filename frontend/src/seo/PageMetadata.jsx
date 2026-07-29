import { useEffect } from "react";
import { useLocation } from "react-router";
import { getSeoForPath } from "./metadata.js";
import { applyPageMetadata } from "./applyMetadata.js";

export default function PageMetadata() {
  const location = useLocation();

  useEffect(() => {
    applyPageMetadata(getSeoForPath(location.pathname));
  }, [location.pathname]);

  return null;
}
