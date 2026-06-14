// export const MODE = import.meta.env["VITE_MODE"] || "";
// if (!MODE) {
//   throw new Error("VITE_MODE is not defined");
// }
// export const API_URL = "http://localhost:3000/api";
export const API_URL = import.meta.env["VITE_API_URL"] || "";
if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}
// export const VITE_API_CSHARP_URL = import.meta.env["VITE_API_CSHARP_URL"] || "";
// if (!VITE_API_CSHARP_URL) {
//   throw new Error("VITE_API_CSHARP_URL is not defined");
// }
// export const VITE_AUTHENTICATION_URL =
//   import.meta.env["VITE_AUTHENTICATION_URL"] || "";
// if (!VITE_AUTHENTICATION_URL) {
//   throw new Error("VITE_AUTHENTICATION_URL is not defined");
// }
// export const VITE_FEATURE_FLAG_PD =
//   import.meta.env["VITE_FEATURE_FLAG_PD"] === "TRUE" ? true : false;
// export const VITE_FEATURE_FLAG_SO =
//   import.meta.env["VITE_FEATURE_FLAG_SO"] === "TRUE" ? true : false;
// export const VITE_FEATURE_FLAG_TIME_ADVANCED =
//   import.meta.env["VITE_FEATURE_FLAG_TIME_ADVANCED"] === "TRUE" ? true : false;
