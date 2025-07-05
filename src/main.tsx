import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Projects from "./submit/project.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

const allowSubmission = () => {
  const deadlineStart = new Date("2025-07-06T00:00:00"); // July 6th, 2025 at 12:00 AM IST
  const date = new Date();
  const now = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const nowDate = new Date(now);
  return nowDate >= deadlineStart;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {allowSubmission() && (
          <Route path="/submit" element={<Projects />} />
        )}
        <Route path="*" element={<App allowSubmission={allowSubmission()} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
