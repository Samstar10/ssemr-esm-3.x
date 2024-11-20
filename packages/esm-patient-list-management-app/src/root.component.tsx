import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListsDashboard from "./views/client-lists.component";
import { RouteProtectionComponent } from "@ssemr/esm-route-protection-app";

const RootComponent: React.FC = () => {
  const patientListsBasename =
    window.getOpenmrsSpaBase() + "home/patient-lists";

  return (
    <BrowserRouter basename={patientListsBasename}>
      <RouteProtectionComponent requiredPrivilege="View Dashboards And Reports">
        <Routes>
          <Route path="/" element={<ListsDashboard />} />
        </Routes>
      </RouteProtectionComponent>
    </BrowserRouter>
  );
};

export default RootComponent;
