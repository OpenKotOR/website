import { useAppContext } from '../../../hooks/useAppContext';

export default function ThemeToggle() {
  const { state, updateTheme } = useAppContext();
  const { mode } = state.theme;

  const handleThemeChange = (newMode: 'light' | 'dark' | 'auto') => {
    updateTheme({ mode: newMode });
  };

  return (
    <div className="theme-toggle">
      <label htmlFor="theme-select" className="sr-only">Theme</label>
      <select
        id="theme-select"
        value={mode}
        onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'auto')}
        style={{
          padding: "6px 8px",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,.18)",
          background: "var(--bg-soft)",
          color: "var(--text)",
          outline: "none",
          fontSize: 14
        }}
      >
        <option value="auto">🌓 Auto</option>
        <option value="light">☀️ Light</option>
        <option value="dark">🌙 Dark</option>
      </select>
    </div>
  );
}
