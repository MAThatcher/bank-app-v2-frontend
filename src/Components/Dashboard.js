import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../Misc/ApiBaseUrl";

const Dashboard = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = ApiConfig.getBaseUrl();
  
  const isAuthenticated = () => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken && accessToken.length > 0;
  };

  // const fetchDashboardData = async () => {
  //   try {
  //     const endpoint = `${baseUrl}/api/dashboard/`;
  //     const response = await fetch(endpoint, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status} - ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     console.log("Dashboard Data:", data);
  //   } catch (error) {
  //     console.error("Failed to load dashboard data:", error);
  //     navigate("/");
  //   }
  // };

  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     console.warn("No valid token found. Redirecting to login...");
  //     navigate("/");
  //   } else {
  //     console.log("Valid token found. Loading dashboard...");
  //     fetchDashboardData();
  //   }
  // }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated()) {
      console.warn("No valid token found. Redirecting to login...");
      navigate("/");
    } else {
      console.log("Valid token found. Loading dashboard...");
    }

    const fetchAccounts = async () => {
      try {
        const endpoint = `${baseUrl}/api/dashboard/`;
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAccounts(data.accounts);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        {accounts.length === 0 ? (
          <p>No accounts found</p>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              onClick={() => navigate(`/account/${account.id}`)}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <h3>{account.name}</h3>
              <p>{account.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
