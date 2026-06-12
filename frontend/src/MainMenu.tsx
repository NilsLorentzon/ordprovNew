// app.js

import { clsx } from "clsx";
import React, { useContext, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { routePaths } from "./routes/MainRoutes";
import OwlIcon from "./assets/SVG/OwlIcon";
import HouseIcon from "./assets/SVG/HouseIcon";
import QuizIcon from "./assets/SVG/QuizIcon";
import ListIcon from "./assets/SVG/ListIcon";
// import CogIcon from "./assets/SVG/CogIcon";
import LoginIcon from "./assets/SVG/LoginIcon";
import { AuthContext } from "./providers/AuthenticationProvider";
import { signout } from "./features/LoginPage";
import StatisticsIcon from "./assets/SVG/StatisticsIcon";
import CreateAccountIcon from "./assets/SVG/CreateAccountIcon";
// import BookmarkNormalIcon from "./assets/SVG/BookmarkNormalIcon";
import SideMenuIcon from "./assets/SVG/SideMenuIcon";
import useClickOutside from "./hooks/useClickOutside";
import { motion } from "motion/react";
import { useIsMobile } from "./hooks/useIsMobile";
import { Menu, MenuItem, MenuTrigger } from "./Components/Menu";
import { Button } from "./Components/Button";
import { MoreVertical } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

const MainMenu = ({ children }: Props) => {
  const isMobile = useIsMobile();
  return (
    <div className="h-full">
      <div className={clsx("h-full", isMobile ? "block" : "flex")}>
        {isMobile ? <MobileMenu></MobileMenu> : <WebMenu></WebMenu>}
        <main
          id="main-content"
          className={clsx(
            isMobile
              ? "w-full relative overflow-auto h-full pt-12"
              : "w-full relative overflow-auto",
          )}
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
  // return (
  //   <>
  //     <div className="hidden md:block h-full">
  //       <WebMenu>{children}</WebMenu>
  //     </div>
  //     <div className="block md:hidden h-full">
  //       <MobileMenu>{children}</MobileMenu>
  //     </div>
  //   </>
  // );
};
const WebMenu = () => {
  // const [isOpen, setIsOpen] = useState(true);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();
  const currentPath = location.pathname; // React Router now tracks this!
  return (
    <nav
      className="max-w-60 w-full bg-p-200 flex flex-col h-full"
      role="navigation"
    >
      <button
        className="flex  items-center gap-1 ml-1 mt-2 mr-2 group"
        aria-label="Gå till startsidan"
        onClick={() => {
          navigate(routePaths.start);
        }}
      >
        <div className="">
          {/* <Link to={`${routePaths.start}`} className="" aria-label="Gå till startsidan"> */}
          <OwlIcon className="w-10 h-10 " />
          {/* </Link> */}
        </div>
        <div className="text-3xl tracking-tight font-medium text-p-900  group-hover:text-p-700  ">
          Ordprov
          <span className="text-[12px]  tracking-wide">.com</span>
        </div>
      </button>
      <div className="mt-8 px-2 flex flex-col justify-between h-full">
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
          <Link to={`${routePaths.information}`} className=" ">
            <div
              className={clsx(
                "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-1 flex items-end",
                currentPath === routePaths.information && "bg-p-300",
              )}
            >
              <HouseIcon className="w-5 h-5 fill-white inline-block mr-2" />
              <div className="h-full leading-4 text-sm">Om oss</div>
            </div>
          </Link>
          <Link to={`${routePaths.prov}`} className="">
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
          <Link to={`${routePaths.ordlista}`} className=" ">
            <div
              className={clsx(
                "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-1 flex items-end",
                currentPath.includes("ordlista") && "bg-p-300",
              )}
            >
              <ListIcon className="w-5 h-5 fill-white inline-block mr-2" />
              <div className="h-full leading-4 text-sm">Ordlista</div>
            </div>
          </Link>

          {/* {auth.email && (
              <Link to={`${routePaths.repetition}`} className=" ">
                <div
                  className={clsx(
                    "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-1 flex items-end",
                    currentPath === routePaths.repetition && "bg-p-300",
                  )}
                >
                  <BookmarkNormalIcon className="w-5 h-5 fill-white inline-block mr-2" />
                  <div className="h-full leading-4 text-sm">Repetition</div>
                </div>
              </Link>
            )} */}

          {auth.email && (
            <Link to={`${routePaths.statistics}`} className=" ">
              <div
                className={clsx(
                  "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-1 flex items-end",
                  currentPath === routePaths.statistics && "bg-p-300",
                )}
              >
                <StatisticsIcon className="w-5 h-5 fill-white inline-block mr-2" />
                <div className="h-full leading-4 text-sm">Statistik</div>
              </div>
            </Link>
          )}
        </div>
        <div className="">
          {/* {auth.email && (
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
            )} */}
          {!auth.email && (
            <Link to={`${routePaths.signup}`} className=" ">
              <div
                className={clsx(
                  "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-1 flex items-end",
                  currentPath === routePaths.signup && "bg-p-300",
                )}
              >
                <CreateAccountIcon className="w-5 h-5 fill-white inline-block mr-2" />
                <div className="h-full leading-4 text-sm">Skapa konto</div>
              </div>
            </Link>
          )}
          {auth.email ? (
            <div className="w-full">
              <div
                className={clsx(
                  "text-white px-3 pr-0 py-2  w-full rounded-md mb-2 flex items-center justify-between",
                  // currentPath === routePaths.login && "bg-p-300",
                )}
              >
                <div className="h-full text-lg flex flex-col items-start">
                  <span className="">{auth.userName}</span>
                  <span className="text-sm text-p-800">{auth.email}</span>
                </div>
                <MenuTrigger>
                  <Button aria-label="Actions" variant="quiet">
                    <MoreVertical className="w-5 h-5 stroke-white " />
                  </Button>
                  <Menu className="bg-amber-300">
                    <MenuItem
                      onAction={() => {
                        // signout();
                        // setIsOpen(false);
                      }}
                    >
                      Profil inställningar
                    </MenuItem>
                    <MenuItem
                      onAction={() => {
                        signout();
                      }}
                    >
                      logga ut{" "}
                    </MenuItem>
                  </Menu>
                </MenuTrigger>
              </div>
            </div>
          ) : (
            <Link to={`${routePaths.login}`} className=" ">
              <div
                className={clsx(
                  "text-white px-3 pl-2.5 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-end",
                  currentPath === routePaths.login && "bg-p-300",
                )}
              >
                <LoginIcon className="w-5 h-5 fill-white inline-block mr-2" />
                <div className="h-full text-sm  leading-5">Logga in</div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth } = useContext(AuthContext);
  const modalReference = useRef<HTMLElement>(null);
  useClickOutside(
    modalReference as React.RefObject<HTMLElement>,
    () => {
      setIsOpen(false);
    },
    ["side-menu-button"],
  );
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname; // React Router now tracks this!
  return (
    <nav className="">
      <div className="h-14 fixed z-30 bg-p-200 w-full flex items-center justify-between pr-2">
        <button
          className="flex items-end ml-1 group"
          aria-label="Gå till startsidan"
          onClick={() => {
            navigate(routePaths.start);
            setIsOpen(false);
          }}
        >
          <div className=" ">
            <OwlIcon className="w-10 h-10 " />
            {/* <Link to={`${routePaths.start}`} className=" ">
              </Link> */}
          </div>
          <div className="text-2xl tracking-tight font-medium text-p-900  group-hover:text-p-700  ">
            Ordprov
            <span className="text-[12px] tracking-wide">.com</span>
          </div>
        </button>
        <button
          className=""
          onClick={() => setIsOpen((prev) => !prev)}
          id="side-menu-button"
          aria-label={isOpen ? "Stäng meny" : "Öppna meny"}
        >
          <SideMenuIcon className="w-8 h-8 fill-white" />
        </button>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          // exit={{ opacity: 1, x: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          ref={modalReference as any}
          className="fixed max-h-full  z-30 bg-p-200 top-13 bottom-0 left-0 w-full max-w-60 mt-0 px-2 flex flex-col justify-between "
        >
          <div className={clsx("mt-4")}>
            <Link
              to={`${routePaths.start}`}
              className=" "
              onClick={() => setIsOpen(false)}
            >
              <div
                className={clsx(
                  "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-end",
                  currentPath === routePaths.start && "bg-p-300",
                )}
              >
                <HouseIcon className="w-5 h-5 fill-white inline-block mr-2" />
                <div className="h-full leading-4 text-md">Startsida</div>
              </div>
            </Link>
            <Link
              to={`${routePaths.information}`}
              className=" "
              onClick={() => setIsOpen(false)}
            >
              <div
                className={clsx(
                  "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-end",
                  currentPath === routePaths.information && "bg-p-300",
                )}
              >
                <HouseIcon className="w-5 h-5 fill-white inline-block mr-2" />
                <div className="h-full leading-4 text-md">Om oss</div>
              </div>
            </Link>
            <Link
              to={`${routePaths.prov}`}
              className=" "
              onClick={() => setIsOpen(false)}
            >
              <div
                className={clsx(
                  "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-end",
                  currentPath === routePaths.prov && "bg-p-300",
                )}
              >
                <QuizIcon className="w-5 h-5 fill-white inline-block mr-2" />
                <div className="h-full leading-4 text-md">Prov</div>
              </div>
            </Link>

            <Link
              to={`${routePaths.ordlista}`}
              className=" "
              onClick={() => setIsOpen(false)}
            >
              <div
                className={clsx(
                  "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-end",
                  currentPath.includes("ordlista") && "bg-p-300",
                )}
              >
                <ListIcon className="w-5 h-5 fill-white inline-block mr-2" />
                <div className="h-full leading-4 text-md">Ordlista</div>
              </div>
            </Link>

            {auth.email && (
              <>
                <div className="text-white text-lg mt-8 pl-1 mb-2">
                  Mina Sidor
                </div>
                <Link
                  to={`${routePaths.statistics}`}
                  className=" "
                  onClick={() => setIsOpen(false)}
                >
                  <div
                    className={clsx(
                      "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-end",
                      currentPath === routePaths.statistics && "bg-p-300",
                    )}
                  >
                    <StatisticsIcon className="w-5 h-5 fill-white inline-block mr-2" />
                    <div className="h-full leading-4 text-md">Statistik</div>
                  </div>
                </Link>
                <Link
                  to={`${routePaths.statistics}`}
                  className=" "
                  onClick={() => setIsOpen(false)}
                >
                  <div
                    className={clsx(
                      "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-end",
                      currentPath === routePaths.statistics && "bg-p-300",
                    )}
                  >
                    <StatisticsIcon className="w-5 h-5 fill-white inline-block mr-2" />
                    <div className="h-full leading-4 text-md">Historik</div>
                  </div>
                </Link>
              </>
            )}
          </div>
          <div className="">
            {/* {auth.email && (
                <Link
                  to={`${routePaths.settings}`}
                  className=" "
                  onClick={() => setIsOpen(false)}
                >
                  <div
                    className={clsx(
                      "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-end",
                      currentPath === routePaths.settings && "bg-p-300",
                    )}
                  >
                    <CogIcon className="w-5 h-5 fill-white inline-block mr-2" />
                    <div className="h-full leading-4 text-md">
                      Inställningar
                    </div>
                  </div>
                </Link>
              )} */}
            {!auth.email && (
              <Link
                to={`${routePaths.signup}`}
                className=" "
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={clsx(
                    "text-white px-3 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-end",
                    currentPath === routePaths.signup && "bg-p-300",
                  )}
                >
                  <CreateAccountIcon className="w-5 h-5 fill-white inline-block mr-2" />
                  <div className="h-full leading-4 text-md">Skapa konto</div>
                </div>
              </Link>
            )}
            {auth.email ? (
              <div className="w-full">
                <div
                  className={clsx(
                    "text-white px-3 py-2  w-full rounded-md mb-2 flex items-center justify-between",
                    // currentPath === routePaths.login && "bg-p-300",
                  )}
                >
                  <div className="h-full text-lg flex flex-col items-start">
                    <span className="">{auth.userName}</span>
                    <span className="text-sm text-p-800">{auth.email}</span>
                  </div>
                  <MenuTrigger>
                    <Button aria-label="Actions" variant="quiet">
                      <MoreVertical className="w-5 h-5 stroke-white " />
                    </Button>
                    <Menu className="bg-amber-300">
                      <MenuItem
                        onAction={() => {
                          // signout();
                          // setIsOpen(false);
                        }}
                      >
                        Profil inställningar
                      </MenuItem>
                      <MenuItem
                        onAction={() => {
                          signout();
                          setIsOpen(false);
                        }}
                      >
                        logga ut{" "}
                      </MenuItem>
                    </Menu>
                  </MenuTrigger>
                </div>
              </div>
            ) : (
              <Link
                to={`${routePaths.login}`}
                className=" "
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={clsx(
                    "text-white px-3 pl-2.5 py-2 hover:bg-p-400 w-full rounded-md mb-2 flex items-end",
                    currentPath === routePaths.login && "bg-p-300",
                  )}
                >
                  <LoginIcon className="w-5 h-5 fill-white inline-block mr-2.5" />
                  <div className="h-full text-md leading-5">Logga in</div>
                </div>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default MainMenu;
