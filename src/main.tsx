import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PraxiosProvider } from "./os/store";
import "./styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("No se encontró el nodo #root.");

createRoot(root).render(
  <StrictMode>
    <PraxiosProvider>
      <App />
    </PraxiosProvider>
  </StrictMode>,
);
