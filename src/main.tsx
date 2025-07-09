import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Projects from "./submit/project.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Dare from "./spin/Dare.tsx";
import Result from "./results/result.tsx";

const allowSubmission = () => {
  return false; // Disable submission for now
};

const SHOW_RESULTS=false; // Set to true to show results page

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {allowSubmission() && (
          <Route path="/submit" element={<Projects />} />
        )}
        {SHOW_RESULTS && <Route path="/results" element={<Result />} />}
        <Route path="/dare" element={<Dare />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
