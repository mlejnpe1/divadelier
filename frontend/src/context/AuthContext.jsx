import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return null;
      }

      const data = await res.json();
      setUser(data);
      return data;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      setLoading(true);
      const data = await refreshAuth();

      if (cancelled) {
        return;
      }

      if (!data) {
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async ({ email, password }) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(payload.message || "Neplatné přihlašovací údaje");
    }

    const data = await refreshAuth();

    if (!data) {
      throw new Error("Přihlášení proběhlo, ale nepodařilo se obnovit uživatele.");
    }

    return data;
  };

  const logout = async () => {
    const res = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error(payload.message || "Odhlášení se nepodařilo.");
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth musí být použitý uvnitř AuthProvider.");
  }

  return context;
}
