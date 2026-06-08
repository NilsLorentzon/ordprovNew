import { useState, useEffect } from "react";

export const useIsMobile = () => {
  // Default to false (or true depending on your SSR/mobile-first preference)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Tailwind's md breakpoint is 768px.
    // We check if the viewport is max-width: 767px (mobile/tablet territory)
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    // Set the initial value
    setIsMobile(mediaQuery.matches);

    // Create a listener callback
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Modern browsers support addEventListener on matchMedia
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Clean up the listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return isMobile;
};
