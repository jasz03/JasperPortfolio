import { useState, useEffect } from "react";
import { PredictiveArcCanvas } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

/**
 * Tracks `prefers-reduced-motion`, including changes made while the page is open
 * (the OS setting can be toggled live, so a one-off read is not enough).
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event) => setReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export default function ShaderBackground(){
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // The animated canvas is unmounted rather than merely hidden: hiding it with CSS
  // would leave its render loop running, still burning CPU and battery for a
  // visitor who asked for no motion. `.shader-static` keeps the background's
  // character with a fixed gradient instead.
  if (reducedMotion) {
    return (
      <div className="shader-frame">
        <div className="shader-static" aria-hidden="true"></div>
      </div>
    );
  }

  return (
    <div className="shader-frame">

      <PredictiveArcCanvas
        variant="data-pixel"
        mode={theme === "light" ? "light" : "dark"}
        speed={1.00}
        hue={0}
        saturation={1.00}
        brightness={0.40}
      />

    </div>
  );
}
