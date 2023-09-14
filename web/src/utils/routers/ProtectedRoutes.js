import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "../../dashboard";
import PageNotFound from "../components/PageNotFound";
import UploadReport from "../../uploadReport";
import FilterPage from "../../filterPage";
import BackupData from "../../backupData";
import { path } from "./routes";
import { strings } from "../helper/strings";

const { tables } = strings;

const ProtectedRoutes = () => (
  <Routes>
    <Route path={path.entry} element={<Dashboard sidebarKey="1" />} />
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
    <Route path={path.upload} element={<UploadReport sidebarKey="5" />} />
    <Route path={path.backup} element={<BackupData sidebarKey="6" />} />
    <Route path={path.catchall} element={<PageNotFound />} />
  </Routes>
);

export default ProtectedRoutes;
