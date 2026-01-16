import { setAuthToken, removeAuthToken } from "@/lib/cookies";
import { LOGIN } from "@/constants/routes";

export function login(token: string) {
  // Set the token in a cookie using the cookies utility
  setAuthToken(token);

  // redirect to the home page
  window.location.href = "/";
}

export function logout() {
  // Remove the token from the cookie using the cookies utility
  removeAuthToken();

  // redirect to the login page
  window.location.href = "/admin" + LOGIN;
}
