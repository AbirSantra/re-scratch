import { useTheme } from "../store/themeStore";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all cursor-pointer"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-muted)",
        color: "var(--text-secondary)",
      }}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
};
export default ThemeToggle;
