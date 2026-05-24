// app.js

import { clsx } from "clsx";
import React, { useContext, useState } from "react";
import Hamburger from "./Hamburger";
import { useNavigate } from "react-router-dom";
import CollapseIcon from "./assets/SVG/CollapseIcon";
import HamburgerMenuIcon from "./assets/SVG/HamburgerMenuIcon";
import { Link } from "react-router-dom";
import { routePaths } from "./routes/MainRoutes";
import OwlIcon from "./assets/SVG/OwlIcon";
import HouseIcon from "./assets/SVG/HouseIcon";
import QuizIcon from "./assets/SVG/QuizIcon";
import ListIcon from "./assets/SVG/ListIcon";
import CogIcon from "./assets/SVG/CogIcon";
import LoginIcon from "./assets/SVG/LoginIcon";
import { AuthContext } from "./providers/AuthenticationProvider";
import { signout } from "./features/LoginPage";

interface Props {
  children: React.ReactNode;
}
const MainMenu = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const currentPath = window.location.pathname;
  console.log("auth", auth);
  return (
    <div className="flex h-full">
      <div className="max-w-68 w-full bg-p-200 flex flex-col h-full">
        <div className="flex  items-end">
          <div className="-ml-4 -mt-4">
            <OwlIcon className="w-24 h-24 " />
          </div>
          <div className="text-2xl tracking-tight text-p-900 pt-1 px-2 mb-4 -ml-8">
            Ordprov
            <span className="text-[12px]  tracking-wide">.com</span>
          </div>
        </div>
        <div className="mt-4 px-2 flex flex-col justify-between h-full">
          <div className={clsx("")}>
            <Link to={`${routePaths.start}`} className=" ">
              <div
                className={clsx(
                  "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-1 flex items-end",
                  currentPath === routePaths.start && "bg-p-300",
                )}
              >
                <HouseIcon className="w-5 h-5 fill-white inline-block mr-2" />
                <div className="h-full leading-4 text-sm">Startsida</div>
              </div>
            </Link>
            <Link to={`${routePaths.prov}`} className=" ">
              <div
                className={clsx(
                  "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-1 flex items-end",
                  currentPath === routePaths.prov && "bg-p-300",
                )}
              >
                <QuizIcon className="w-5 h-5 fill-white inline-block mr-2" />
                <div className="h-full leading-4 text-sm">Prov</div>
              </div>
            </Link>
            <Link to={`${routePaths.settings}`} className=" ">
              <div
                className={clsx(
                  "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-1 flex items-end",
                  currentPath === routePaths.settings && "bg-p-300",
                )}
              >
                <CogIcon className="w-5 h-5 fill-white inline-block mr-2" />
                <div className="h-full leading-4 text-sm">Inställningar</div>
              </div>
            </Link>
            <Link to={`${routePaths.ordLista}`} className=" ">
              <div
                className={clsx(
                  "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-1 flex items-end",
                  currentPath === routePaths.ordLista && "bg-p-300",
                )}
              >
                <ListIcon className="w-5 h-5 fill-white inline-block mr-2" />
                <div className="h-full leading-4 text-sm">Ordlista</div>
              </div>
            </Link>
            {/* {auth.email && (
              <Link to={`${routePaths.statistics}`} className=" ">
                <div
                  className={clsx(
                    "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-1 flex items-end",
                    currentPath === routePaths.statistics && "bg-p-300",
                  )}
                >
                  <ListIcon className="w-5 h-5 fill-white inline-block mr-2" />
                  <div className="h-full leading-4 text-sm">Statistik</div>
                </div>
              </Link>
            )} */}
          </div>
          <div className="">
            {auth.email ? (
              <button className="w-full" onClick={signout}>
                <div
                  className={clsx(
                    "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-center justify-between",
                    // currentPath === routePaths.login && "bg-p-300",
                  )}
                >
                  <div className="h-full text-lg flex flex-col items-start">
                    <span className="">
                      {auth.name} {auth.lastName}
                    </span>
                    <span className="text-sm text-p-800">{auth.email}</span>
                  </div>
                  <LoginIcon className="w-5 h-5 fill-white inline-block mr-2" />
                </div>
              </button>
            ) : (
              <Link to={`${routePaths.login}`} className=" ">
                <div
                  className={clsx(
                    "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-end justify-between",
                    currentPath === routePaths.login && "bg-p-300",
                  )}
                >
                  <div className="h-full text-lg">Logga in</div>
                  <LoginIcon className="w-5 h-5 fill-white inline-block mr-2" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className={clsx("w-full relative overflow-auto ")}>{children}</div>
    </div>
  );
};

export default MainMenu;
