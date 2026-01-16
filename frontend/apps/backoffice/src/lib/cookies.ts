import { getCookie, removeCookie, setCookie } from "@/hooks/useCookie";

const AUTH_TOKEN_KEY = "auth-token";

export const getAuthToken = (): string | undefined => {
  return getCookie(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  setCookie(AUTH_TOKEN_KEY, token, {
    // secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
    expires: 7, // 7 days
  });
};

export const removeAuthToken = (): void => {
  removeCookie(AUTH_TOKEN_KEY);
};
