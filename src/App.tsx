import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./providers/AppProvider";
import AppHeader from "./components/common/AppHeader/AppHeader";
import Home from "./pages/home/home";

const FormatsPage = lazy(() => import("./pages/formats/FormatsPage"));
const FormatDetailPage = lazy(() => import("./pages/formats/FormatDetailPage"));

/**
 * OpenKotOR — React single‑page app
 *
 * Routes: / (home), /formats (format list), /formats/:formatId (lazy-loaded format JSON).
 */
function OpenKOTORLanding() {
  return (
    <BrowserRouter>
      <AppHeader />
      <main>
        <Suspense fallback={<div className="container section muted">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/formats" element={<FormatsPage />} />
            <Route path="/formats/:formatId" element={<FormatDetailPage />} />
          </Routes>
        </Suspense>
      </main>
      <footer>
        <div className="container row" style={{ justifyContent: "space-between" }}>
          <div>
            <strong>OpenKotOR</strong> <span className="sep">•</span>{" "}
            <span className="muted">Community for KotOR I & II modding</span>
          </div>
          <div className="row">
            <a
              className="ghost"
              href="https://discord.gg/YC7wBqabxA"
              target="_blank"
              rel="noopener"
            >
              Discord
            </a>
            <a
              className="ghost"
              href="https://github.com/OpenKotOR"
              target="_blank"
              rel="noopener"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <OpenKOTORLanding />
    </AppProvider>
  );
}
