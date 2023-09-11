import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "../../dashboard";
import PageNotFound from "../components/PageNotFound";
import { path } from "./routes";
import FilterPage from "../../filterPage";
import { strings } from "../helper/strings";

const { tables } = strings;

const ProtectedRoutes = () => (
  <Routes>
    <Route path={path.entry} element={<Dashboard />} />
    <Route
      path={path.patient}
      element={
        <FilterPage
          key={tables.patients}
          tableName={tables.patients}
          sidebarKey="2"
        />
      }
    />
    <Route
      path={path.visit}
      element={
        <FilterPage
          key={tables.visits}
          tableName={tables.visits}
          sidebarKey="3"
        />
      }
    />
    <Route
      path={path.medicine}
      element={
        <FilterPage
          key={tables.medicines}
          tableName={tables.medicines}
          sidebarKey="4"
        />
      }
    />
    <Route path={path.catchall} element={<PageNotFound />} />
  </Routes>
);

export default ProtectedRoutes;
