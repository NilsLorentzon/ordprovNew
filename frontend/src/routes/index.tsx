import { useContext } from "react";
import { Navigate, useRoutes } from "react-router-dom";
// import LoginPage from "../features/Misc/LoginPage";
import { AuthContext } from "../providers/AuthenticationProvider";
import { mainRoutes } from "./MainRoutes.tsx";
// import RedirectPage from "../features/Misc/RedirectPage";

export default function AppRoutes() {
  const { auth } = useContext(AuthContext);
//   const loggedOutRoutes = [
//     {
//       path: "/authentication",
//       element: <RedirectPage />,
//     },
//     {
//       path: "/",
//       element: <LoginPage />,
//     },
//     {
//       path: "*",
//       element: <Navigate to="/" />,
//     },
//   ];
  // const routes = auth.email ? mainRoutes : loggedOutRoutes;
  const element = useRoutes([...mainRoutes]);
//   const element = useRoutes([...routes]);

  return element;
}