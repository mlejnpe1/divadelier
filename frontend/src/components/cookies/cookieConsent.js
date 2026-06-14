const STORAGE_KEY = "divadelier-cookie-consent-v1";

export function readCookieConsent() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (typeof parsed?.externalContent !== "boolean") {
      return null;
    }

    return {
      externalContent: parsed.externalContent,
    };
  } catch {
    return null;
  }
}

export function writeCookieConsent(consent) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

export function clearCookieConsent() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
