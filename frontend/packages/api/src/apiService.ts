import axios from "axios";
import Cookies from "js-cookie";

// eslint-disable-next-line turbo/no-undeclared-env-vars
export const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const apiService = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache",
  },
  withCredentials: true,
});

// Add request interceptor to include JWT token from auth-token cookie
apiService.interceptors.request.use((request) => {
  // Get the auth token from cookie
  const authToken = Cookies.get("auth-token");

  if (request.headers && authToken) {
    request.headers.Authorization = `Bearer ${authToken}`;
  }

  return request;
});
