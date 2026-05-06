import { apiFetch, ensureCsrfCookie } from "./client";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  password_confirmation: string;
}

/** POST /api/login (Sanctum SPA flow) */
export async function login(payload: LoginPayload) {
  await ensureCsrfCookie();
  return apiFetch<AuthUser>("/login", { method: "POST", body: payload });
}

/** POST /api/register */
export async function register(payload: RegisterPayload) {
  await ensureCsrfCookie();
  return apiFetch<AuthUser>("/register", { method: "POST", body: payload });
}

/** POST /api/logout */
export function logout() {
  return apiFetch<void>("/logout", { method: "POST" });
}

/** GET /api/user — returns the authenticated user, null if guest. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await apiFetch<AuthUser>("/user");
  } catch {
    return null;
  }
}
