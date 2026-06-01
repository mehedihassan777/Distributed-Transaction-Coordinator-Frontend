/**
 * API client with JWT token injection.
 *
 * Server Components call `apiFetch` directly — they read the token from
 * cookies/headers via `getServerToken()`.
 * Client Components call the same helper; the token is sourced from
 * `localStorage` (set after login) via `getClientToken()`.
 */

import { ApiError } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

// --------------------------------------------------------------------------
// Token resolution
// --------------------------------------------------------------------------

/**
 * Read the JWT from the browser's localStorage (client-side only).
 * Returns `null` when called in a Server Component context.
 */
function getClientToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("dtc_access_token");
}

/**
 * Read the JWT from HTTP-only cookies via Next.js `cookies()` helper.
 * Safe to call only in Server Components / Route Handlers.
 */
async function getServerToken(): Promise<string | null> {
  if (typeof window !== "undefined") return null;
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    return jar.get("dtc_access_token")?.value ?? null;
  } catch {
    return null;
  }
}

async function resolveToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return getClientToken();
  }
  return getServerToken();
}

// --------------------------------------------------------------------------
// Core fetch wrapper
// --------------------------------------------------------------------------

export interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Pass an explicit token to override the auto-resolved one. */
  token?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  { body, token: explicitToken, headers: extraHeaders, ...rest }: FetchOptions = {}
): Promise<T> {
  const token = explicitToken ?? (await resolveToken());

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // Ensure RSC caches are opt-in, not implicit
    cache: rest.cache ?? "no-store",
  });

  if (!response.ok) {
    let apiError: ApiError;
    try {
      apiError = (await response.json()) as ApiError;
    } catch {
      apiError = {
        message: response.statusText || "An unknown error occurred",
        statusCode: response.status,
      };
    }
    throw apiError;
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// --------------------------------------------------------------------------
// Convenience methods
// --------------------------------------------------------------------------

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { method: "POST", body, ...options }),

  put: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { method: "PUT", body, ...options }),

  patch: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { method: "PATCH", body, ...options }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { method: "DELETE", ...options }),
};

// --------------------------------------------------------------------------
// Auth token helpers (used by the auth feature)
// --------------------------------------------------------------------------

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("dtc_access_token", token);
  }
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("dtc_access_token");
  }
}
