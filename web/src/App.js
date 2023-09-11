import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProtectedRoutes from "./utils/routers/ProtectedRoutes";
import PublicRoute from "./utils/routers/PublicRoute";
import PrivateRoute from "./utils/routers/PrivateRoute";
import { path } from "./utils/routers/routes";
import LoginPage from "./login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path={path.login}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path={path.catchall}
          element={
            <PrivateRoute>
              <ProtectedRoutes />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
