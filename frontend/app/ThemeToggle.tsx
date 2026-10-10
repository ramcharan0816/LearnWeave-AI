
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="theme-toggle"
        aria-label="Theme switch"
        disabled
      >
        ◐
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        isDark ? "Switch to light theme" : "Switch to dark theme"
      }
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
