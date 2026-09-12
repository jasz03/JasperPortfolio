import { useState, useEffect } from "react";
import { PredictiveArcCanvas } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export default function ShaderBackground(){
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "dark";
    } catch {
      return "dark";
    }
  });

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