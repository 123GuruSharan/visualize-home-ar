import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Registers the <model-viewer> custom element used for 3D / AR previews.
import "@google/model-viewer";

createRoot(document.getElementById("root")!).render(<App />);
