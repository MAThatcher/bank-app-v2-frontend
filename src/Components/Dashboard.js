import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../Misc/ApiBaseUrl";

const Dashboard = () => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken && accessToken.length > 0;
  };

  const fetchDashboardData = async () => {
    try {
      const baseUrl = ApiConfig.getBaseUrl();
      const endpoint = `${baseUrl}/api/dashboard/`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dashboard Data:", data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      console.warn("No valid token found. Redirecting to login...");
      navigate("/");
    } else {
      console.log("Valid token found. Loading dashboard...");
      fetchDashboardData();
    }
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Add components or elements to render dashboard data here */}
    </div>
  );
};

export default Dashboard;
