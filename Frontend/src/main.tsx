import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App, { preloadRoute } from "./App.tsx";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

await preloadRoute(window.location.pathname);

if (rootEl.hasChildNodes()) {
  hydrateRoot(
    rootEl,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
