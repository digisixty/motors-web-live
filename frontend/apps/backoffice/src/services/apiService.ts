import { apiService as baseApiService } from "@workspace/api/apiService";
import { removeAuthToken } from "@/lib/cookies";
import { LOGIN } from "@/constants/routes";

// Create a new axios instance that wraps the base apiService
export const apiService = baseApiService;

// Add response interceptor to handle 401 responses
apiService.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Remove the auth token
      removeAuthToken();

      // Redirect to login page
      window.location.href = "/admin" + LOGIN;
    }

    return Promise.reject(error);
  }
);
