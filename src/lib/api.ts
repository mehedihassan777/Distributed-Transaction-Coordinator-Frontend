import { getToken } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** When true the request is sent from a Server Component — no localStorage token. */
  serverSide?: boolean;
  /** Optional bearer token for server-side requests. */
  serverToken?: string;
}

async function buildHeaders(
  options: RequestOptions,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (options.serverSide && options.serverToken) {
    headers["Authorization"] = "Bearer " + options.serverToken;
  } else if (!options.serverSide) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }
  }

  return headers;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, serverSide: _serverSide, serverToken: _serverToken, ...fetchOptions } = options;
  const headers = await buildHeaders(options);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: { ...headers, ...(fetchOptions.headers as Record<string, string>) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: options.cache ?? "no-store",
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorJson = await response.json();
      message = errorJson?.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(response.status, message);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
