import { useState, useEffect } from "react";

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Check initially
    checkDevice();

    // Add event listener
    window.addEventListener("resize", checkDevice);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return isMobile;
};
