import React, { ReactNode, useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import SignInPage from "../../pages/SignInPage/signInPage";

type RouteGuardProps = {
  element: JSX.Element;
};

const RouteGuard = ({ element }: RouteGuardProps): JSX.Element => {
  const signedIn = useSelector((state: RootState) => state.user.signedIn);

  return signedIn ? element : <SignInPage />;
  // return <SignInPage />;
};

export default RouteGuard;
