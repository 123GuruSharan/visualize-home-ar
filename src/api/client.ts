/**
 * Thin fetch wrapper for the Laravel API.
 * - Reads base URL from VITE_API_BASE_URL
 * - Sends credentials so Laravel Sanctum session cookies work
 * - Forwards the XSRF-TOKEN cookie as the X-XSRF-TOKEN header
 * - Throws ApiError with parsed JSON body on non-2xx responses
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ?? "http://127.0.0.1:8000";

export const USE_FALLBACK =
  (import.meta.env.VITE_USE_FALLBACK_DATA ?? "true") !== "false";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((r) => r.startsWith(name + "="))
    ?.split("=")[1];
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Set false to skip credentials (rare). */
  withCredentials?: boolean;
}

export async function apiFetch<T>(
  path: string,
  { body, headers, withCredentials = true, ...rest }: RequestOptions = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const xsrf = getCookie("XSRF-TOKEN");

  const res = await fetch(url, {
    ...rest,
    credentials: withCredentials ? "include" : "same-origin",
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(xsrf ? { "X-XSRF-TOKEN": decodeURIComponent(xsrf) } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const parsed = text ? safeJson(text) : null;

  if (!res.ok) {
    throw new ApiError(
      res.status,
      (parsed as { message?: string } | null)?.message ?? res.statusText,
      parsed
    );
  }
  return parsed as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Hit `/sanctum/csrf-cookie` once before the first auth request. */
export async function ensureCsrfCookie(): Promise<void> {
  await fetch(`${API_ORIGIN}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}
