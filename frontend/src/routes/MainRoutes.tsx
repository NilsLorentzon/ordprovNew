import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Header from "../Header";
import StartPage from "../StartPage.tsx";
import Quiz from "../Quiz.tsx";
import QuizWrapper from "../QuizWrapper.tsx";
import MainMenu from "../MainMenu.tsx";
import WordListWrapper from "../features/WordListWrapper.tsx";
import LoginPage from "../features/LoginPage.tsx";
import SettingsPage from "../features/SettingsPage.tsx";
import SignupPage from "../features/SignupPage.tsx";
import StatisticsPage from "../features/StatisticsPage.tsx";

const MainRoutesWrapper = lazy(() => import("./MainRoutesWrapper.tsx"));

export const routePaths = {
  start: "/",
  prov: "/prov",
  ordLista: "/ordLista",
  settings: "/settings",
  login: "/login",
  signup: "/signup",
  statistics: "/statistics",
};

export const mainRoutes = [
  {
    path: "",
    element: <MainRoutesWrapper />,
    children: [
      {
        path: routePaths.start,
        element: <StartPage />,
      },
      {
        path: routePaths.prov,
        element: <QuizWrapper />,
      },
      {
        path: routePaths.ordLista,
        element: <WordListWrapper />,
      },
      {
        path: routePaths.settings,
        element: <SettingsPage />,
      },
      {
        path: routePaths.login,
        element: <LoginPage />,
      },
      {
        path: routePaths.statistics,
        element: <StatisticsPage />,
      },

      { path: "/*", element: <Navigate to={routePaths.prov} /> },
      { path: "*", element: <Navigate to={routePaths.prov} /> },
      { path: "", element: <Navigate to={routePaths.start} /> },
    ],
  },
];
