"use client";

import { useCallback, useState } from "react";
import { apiFetch, ApiError, type RequestOptions } from "@/lib/api";

export type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError | Error };

export function useApiClient() {
  const request = useCallback(
    async <T>(
      path: string,
      options?: RequestOptions,
    ): Promise<T> => {
      return apiFetch<T>(path, options);
    },
    [],
  );

  return { request };
}

export function useApiRequest<T>() {
  const [state, setState] = useState<RequestState<T>>({ status: "idle" });
  const { request } = useApiClient();

  const execute = useCallback(
    async (path: string, options?: RequestOptions) => {
      setState({ status: "loading" });
      try {
        const data = await request<T>(path, options);
        setState({ status: "success", data });
        return data;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Unknown error occurred");
        setState({ status: "error", error });
        throw error;
      }
    },
    [request],
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, execute, reset };
}
