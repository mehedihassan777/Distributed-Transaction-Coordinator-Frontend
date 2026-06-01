"use client";

import { useCallback, useEffect, useState } from "react";
import { clearToken, saveToken } from "@/lib/api/client";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

/**
 * Manages the JWT access token in localStorage and provides helpers
 * to log in / log out.  Client Components import this hook to access
 * the current authentication state.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    token: null,
    isAuthenticated: false,
  });

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    const stored = window.localStorage.getItem("dtc_access_token");
    if (stored) {
      setState({ token: stored, isAuthenticated: true });
    }
  }, []);

  const login = useCallback((token: string) => {
    saveToken(token);
    setState({ token, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setState({ token: null, isAuthenticated: false });
  }, []);

  return { ...state, login, logout };
}
