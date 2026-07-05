import { API_URL } from "../config";
import Axios, { type AxiosRequestConfig } from "axios";
import { v4 as uuid } from "uuid";

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
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem("token");
        console.log("401 or 403 error", error.response);
        const data = error.response.data;
        if (data?.reload !== false) {
          // go to /login
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

function setBearerTokenInHeader(headers: AxiosRequestConfig["headers"]) {
  const token = localStorage.getItem("token");
  const userStorageId = localStorage.getItem("userStorageId");
  if (userStorageId && headers) {
    headers["x-user-storage-id"] = userStorageId;
  } else {
    if (userStorageId === null && headers) {
      const newUserStorageId = uuid();
      localStorage.setItem("userStorageId", newUserStorageId);
      headers["x-user-storage-id"] = newUserStorageId;
    }
  }

  if (token && headers) {
    headers["authorization"] = `Bearer ${token}`;
  }
}

export { axios };
