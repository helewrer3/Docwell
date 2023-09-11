import React from "react";
import { Navigate } from "react-router-dom";

import { isAuth } from "../helper/isAuth";
import { path } from "./routes";

const PrivateRoute = ({ children }) => {
  const authed = isAuth();
  return authed ? children : <Navigate to={path.login} />;
};

export default PrivateRoute;
