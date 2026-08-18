import { auth } from "./auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = auth.getToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    auth.logout();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login?expired=1";
    }
    throw new Error("Session expired. Please log in again.");
  }

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" && data !== null && "error" in data
        ? (data as { error: string }).error
        : "An unexpected API error occurred";
    throw new Error(errorMessage);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),

  uploadFile: async (file: File, folder = "portfolio"): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    return request<{ url: string; publicId: string }>("/upload", {
      method: "POST",
      body: formData,
    });
  },
};
