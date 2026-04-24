import axios, { AxiosError } from "axios";

/**
 * Axios client — sab requests Express backend ke through jaati hain.
 * baseURL empty hai kyunki Vite proxy /api ko Express :3000 pe forward karta hai.
 */

export const api = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/** Convert any axios error into a clean, user-readable message. */
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{ message?: string; exc?: string; _server_messages?: string }>;
    const data = ax.response?.data;

    if (data?.message) return data.message;

    if (data?._server_messages) {
      try {
        const arr = JSON.parse(data._server_messages) as string[];
        const first = arr[0];
        if (first) {
          const parsed = JSON.parse(first) as { message?: string };
          if (parsed.message) return parsed.message;
        }
      } catch {
        // fall through to default
      }
    }

    if (ax.response?.status === 401) return "You need to log in to continue.";
    if (ax.response?.status === 403) return "You don't have permission to do that.";
    if (ax.code === "ERR_NETWORK") return "Couldn't reach the server. Please try again.";
    return ax.message;
  }

  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

// Hamesha true — Express backend hamesha available hai
export const isErpnextConfigured = true;
