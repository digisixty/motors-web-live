"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COOKIE_KEY = "auth-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  // Load token from cookie on mount
  useEffect(() => {
    const storedToken = Cookies.get(COOKIE_KEY) || null;
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  const setToken = (token: string | null) => {
    if (token) {
      // Store in cookie with 7 days expiry
      Cookies.set(COOKIE_KEY, token, { expires: 7 });
      setTokenState(token);
    } else {
      Cookies.remove(COOKIE_KEY);
      setTokenState(null);
    }
  };

  const logout = () => {
    Cookies.remove(COOKIE_KEY);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated: !!token,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
