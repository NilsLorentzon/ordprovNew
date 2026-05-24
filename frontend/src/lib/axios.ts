import { API_URL } from "../config";
import Axios from "axios";
import type { AxiosRequestConfig } from "axios";

function authRequestInterceptor(config: AxiosRequestConfig) {
  config.headers = config.headers ?? {};
  setBearerTokenInHeader(config.headers);
  config.headers.Accept = "application/json";
  return config;
}

const axios = Axios.create({
  baseURL: API_URL,
});
axios.interceptors.request.use(authRequestInterceptor as any);
axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // console.log("401 error", error.response);
        // const data = error.response.data;
        // if (data?.reload !== false) {
        // go to /login
        window.location.href = "/login";
        // }
      }
    }
    return Promise.reject(error);
  },
);

function setBearerTokenInHeader(headers: AxiosRequestConfig["headers"]) {
  const token = localStorage.getItem("token");
  if (token && headers) {
    headers["authorization"] = `Bearer ${token}`;
  }
}

export { axios };
