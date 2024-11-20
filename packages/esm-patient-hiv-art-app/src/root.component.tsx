import React from "react";
import { SWRConfig } from "swr";
import HomeDashboard from "./views/home-dashboard.component";
import DashboardProvider from "./context/DashboardContext";
import classnames from "classnames";
import styles from "./root.scss";
import { BrowserRouter } from "react-router-dom";
import { RouteProtectionComponent } from "@ssemr/esm-route-protection-app";

const RootComponent: React.FC = () => {
  const baseName = window.getOpenmrsSpaBase() + "home/hivcare-and-art";
  return (
    <main
      className={classnames("omrs-main-content", styles.dashboardContainer)}
    >
      <SWRConfig>
        <RouteProtectionComponent requiredPrivilege="View Dashboards And Reports">
          <BrowserRouter basename={baseName}>
            <DashboardProvider>
              <HomeDashboard />
            </DashboardProvider>
          </BrowserRouter>
        </RouteProtectionComponent>
      </SWRConfig>
    </main>
  );
};

export default RootComponent;
