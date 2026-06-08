import { lazy } from "react";
import { Navigate } from "react-router-dom";
import StartPage from "../StartPage.tsx";
import QuizWrapper from "../QuizWrapper.tsx";
import LoginPage from "../features/LoginPage.tsx";
import SettingsPage from "../features/SettingsPage.tsx";
import SignupPage from "../features/SignupPage.tsx";
import InformationPage from "../InformationPage.tsx";
import RepetitionPage from "../features/RepetitionPage.tsx";
import StatisticsPageWrapper from "../features/StatisticsPageWrapper.tsx";
import WordListWrapperDetail from "../features/WordListWrapperDetail.tsx";
import WordListWrapper from "../features/WordListWrapper.tsx";
import ReportPage from "../features/ReportPage.tsx";

const MainRoutesWrapper = lazy(() => import("./MainRoutesWrapper.tsx"));

export const routePaths = {
  start: "/",
  information: "/om-oss",
  prov: "/prov",
  ordlista: "/ordlista/tidigare-högskoleprov",
  ordlistaDetail: "/ordlista/tidigare-högskoleprov/:word",
  // settings: "/settings",
  // repetition: "/repetition",
  login: "/login",
  signup: "/signup",
  statistics: "/statistics",
  report: "/felanmälan",
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
        path: routePaths.information,
        element: <InformationPage />,
      },
      {
        path: routePaths.prov,
        element: <QuizWrapper />,
      },
      {
        path: routePaths.ordlistaDetail,
        element: <WordListWrapper />,
      },
      {
        path: routePaths.ordlista,
        element: <WordListWrapper />,
      },
      // {
      //   path: routePaths.settings,
      //   element: <SettingsPage />,
      // },
      {
        path: routePaths.login,
        element: <LoginPage />,
      },
      {
        path: routePaths.signup,
        element: <SignupPage />,
      },
      {
        path: routePaths.statistics,
        element: <StatisticsPageWrapper />,
      },
      // {
      //   path: routePaths.repetition,
      //   element: <RepetitionPage />,
      // },
      {
        path: routePaths.report,
        element: <ReportPage />,
      },

      { path: "/*", element: <Navigate to={routePaths.prov} /> },
      { path: "*", element: <Navigate to={routePaths.prov} /> },
      { path: "", element: <Navigate to={routePaths.start} /> },
    ],
  },
];
