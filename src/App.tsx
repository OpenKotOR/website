import { AppProvider } from "./providers/AppProvider";
import AppHeader from "./components/common/AppHeader/AppHeader";
import Home from "./pages/home/home";

/**
 * OpenKotOR — React single‑page landing
 *
 * Main application component that provides context and renders the landing page.
 */
function OpenKOTORLanding() {
  return (
    <>
      <AppHeader />
      <main>
        <Home />
      </main>
      <footer>
        <div className="container row" style={{ justifyContent: "space-between" }}>
          <div>
            <strong>OpenKotOR</strong> <span className="sep">•</span> <span className="muted">Community for KotOR I & II modding</span>
          </div>
          <div className="row">
            <a className="ghost" href="https://discord.gg/YC7wBqabxA" target="_blank" rel="noopener">Discord</a>
            <a className="ghost" href="https://github.com/OpenKotOR" target="_blank" rel="noopener">GitHub</a>
            {/* <a className="ghost" href="https://docs.openkotor.com" target="_blank" rel="noopener">Docs</a> */}
          </div>
        </div>
      </footer>
    </>
  );
}

// Main App component with AppProvider
export default function App() {
  return (
    <AppProvider>
      <OpenKOTORLanding />
    </AppProvider>
  );
}
