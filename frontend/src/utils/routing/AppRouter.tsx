import { BrowserRouter, Route, Routes } from "react-router-dom";

import React from "react";
import DataGridPage from "../../pages/DataGridPage/DataGridPage";
import SignInPage from "../../pages/SignInPage/signInPage";
import SignUpPage from "../../pages/SignUpPage/signUpPage";
import RouteGuard from "./RouteGuard";

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
