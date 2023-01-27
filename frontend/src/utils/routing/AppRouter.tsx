import { BrowserRouter, Route, Routes } from "react-router-dom";

import React from "react";
import DataGridPage from "../../pages/DataGridPage/DataGridPage";
import RouteGuard from "./RouteGuard";
import SignUpPage from "../../pages/SignUpPage/SignUpPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RouteGuard element={<DataGridPage />} />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
