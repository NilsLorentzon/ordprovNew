import { useRoutes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import StartPage from "../features/Pages/StartPage.tsx";
import QuizWrapper from "../features/Quiz/QuizWrapper.tsx";
import LoginPage from "../features/Pages/LoginPage.tsx";
import SignupPage from "../features/Pages/SignupPage.tsx";
import InformationPage from "../features/Pages/InformationPage.tsx";
import StatisticsPageWrapper from "../features/Pages/StatisticsPageWrapper.tsx";
import WordListWrapper from "../features/WordListWrapper.tsx";
import ReportPage from "../features/Pages/ReportPage.tsx";
import QuizMultipleChoiceWrapper from "../features/Quiz/QuizMultipleChoiceWrapper.tsx";
import DonationPage from "../features/Pages/DonationPage.tsx";
import MainRoutesWrapper from "./MainRoutesWrapper.tsx";
import AdminPage from "../features/Pages/AdminPage.tsx";

// const MainRoutesWrapper = lazy(() => import("./MainRoutesWrapper.tsx"));

export const routePaths = {
  start: "/",
  information: "/om-oss",
  prov: "/prov",
  provStart: "/prov/start",
  ordlista: "/ordlista/tidigare-högskoleprov",
  ordlistaDetail: "/ordlista/tidigare-högskoleprov/:word",
  donation: "/donation",
  login: "/login",
  signup: "/signup",
  report: "/felanmälan",
  statistics: "/statistics",
  admin: "/admin",
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
        path: routePaths.provStart,
        element: <QuizMultipleChoiceWrapper />,
      },
      {
        path: routePaths.ordlistaDetail,
        element: <WordListWrapper />,
      },
      {
        path: routePaths.ordlista,
        element: <WordListWrapper />,
      },
      {
        path: routePaths.donation,
        element: <DonationPage />,
      },
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
      {
        path: routePaths.report,
        element: <ReportPage />,
      },
      {
        path: routePaths.admin,
        element: <AdminPage />,
      },

      { path: "/*", element: <Navigate to={routePaths.start} /> },
      { path: "*", element: <Navigate to={routePaths.start} /> },
      { path: "", element: <Navigate to={routePaths.start} /> },
    ],
  },
];

export default function MainRoutes() {
  const element = useRoutes(mainRoutes);
  return element;
}
