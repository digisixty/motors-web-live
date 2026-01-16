import { apiService } from "../apiService";
import Axios, { AxiosError, AxiosRequestConfig } from "axios";

// add a second `options` argument here if you want to pass extra options to each generated query
type CancellablePromise<T> = Promise<T> & { cancel: () => void };

export const api = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): CancellablePromise<T> => {
  const source = Axios.CancelToken.source();
  const promise = apiService({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data) as CancellablePromise<T>;

  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;
