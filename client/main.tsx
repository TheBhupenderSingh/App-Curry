import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";

import { BASE_URL } from "@/config";
(window as any).BASE_URL = BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
