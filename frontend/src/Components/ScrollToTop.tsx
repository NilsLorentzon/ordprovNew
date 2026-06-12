import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById("main-content")?.scrollTo(0, 0);
    // console.log("scrolling to top");
  }, [pathname]);

  return null; // This component doesn't render any visual UI
}
