import { useEffect, useState } from "react";
import { readCookieConsent, writeCookieConsent } from "./cookieConsent";

export default function useCookieConsent() {
  const [consent, setConsentState] = useState(null);

  useEffect(() => {
    setConsentState(readCookieConsent());
  }, []);

  const setConsent = (nextConsent) => {
    setConsentState(nextConsent);
    writeCookieConsent(nextConsent);
  };

  return {
    consent,
    setConsent,
  };
}
