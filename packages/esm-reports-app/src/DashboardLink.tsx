import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./dashboardLink.css";

export interface DashboardLinkConfig {
  name: string;
  title: string;
}

export function DashboardExtension({
                                     dashboardLinkConfig,
                                   }: {
  dashboardLinkConfig: DashboardLinkConfig;
}) {
  const { t } = useTranslation();
  const { name, title } = dashboardLinkConfig;
  const location = useLocation();
  const spaBasePath = `${window.spaBase}/home`;

  // State for logged-in location
  const [loggedInLocation, setLoggedInLocation] = useState<string | null>(null);

  // Fetch logged-in location from session API
  useEffect(() => {
    const fetchLoggedInLocation = async () => {
      try {
        const response = await fetch("/openmrs/ws/rest/v1/session");
        if (response.ok) {
          const data = await response.json();
          const location = data?.sessionLocation?.uuid;
          setLoggedInLocation(location);
        } else {
          console.error("Failed to fetch session location");
        }
      } catch (error) {
        console.error("Error fetching session location:", error);
      }
    };

    fetchLoggedInLocation();
  }, []);

  const navLink = useMemo(() => {
    const pathArray = location.pathname.split("/home");
    const lastElement = pathArray[pathArray.length - 1];
    return decodeURIComponent(lastElement);
  }, [location.pathname]);

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const reportsUrl = useMemo(() => {
    // Append logged-in location to URL if available
    return loggedInLocation
      ? `${baseUrl}/openmrs/ssemrreports/reports.page?location=${loggedInLocation}`
      : `${baseUrl}/openmrs/ssemrreports/reports.page`;
  }, [baseUrl, loggedInLocation]);

  const handleClick = () => {
    const url = name === "reports" ? reportsUrl : `${spaBasePath}/${name}`;
    window.open(url, "_blank");
  };

  return (
    <button
      className={`cds--side-nav__link ${
        navLink.match(name) && "active-left-nav-link"
      }`}
      style={{
        paddingLeft: "50px",
        lineHeight: "inherit",
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: "0",
        marginLeft: "17px",
        fontSize: "15px",
        color: "inherit",
      }}
      onClick={handleClick}
    >
      {t(name, title)}
    </button>
  );
}

export const createDashboardLink =
  (dashboardLinkConfig: DashboardLinkConfig) => () =>
    (
      <BrowserRouter>
        <DashboardExtension dashboardLinkConfig={dashboardLinkConfig} />
      </BrowserRouter>
    );
