import Cookies from "js-cookie";

export const setCookie = (
  name: string,
  value: string,
  options?: Cookies.CookieAttributes
): string | undefined => Cookies.set(name, value, options);

export const getCookie = (name: string): string | undefined =>
  Cookies.get(name);

export const removeCookie = (
  name: string,
  options?: Cookies.CookieAttributes
): void => Cookies.remove(name, options);

const useCookie = () => ({ setCookie, getCookie, removeCookie });

export default useCookie;
