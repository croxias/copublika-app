"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="cp-icobtn" aria-label="Toggle theme">
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
