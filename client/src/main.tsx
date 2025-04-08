import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import Font Awesome CSS
import "@fortawesome/fontawesome-free/css/all.min.css";

createRoot(document.getElementById("root")!).render(<App />);
