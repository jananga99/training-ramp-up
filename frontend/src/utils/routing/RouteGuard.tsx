import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import SignInPage from "../../pages/SignInPage/SignInPage";

type RouteGuardProps = {
  element: JSX.Element;
};

const RouteGuard = ({ element }: RouteGuardProps): JSX.Element => {
  const signedIn = useSelector((state: RootState) => state.auth.signedIn);
  return signedIn ? element : <SignInPage />;
};

export default RouteGuard;
