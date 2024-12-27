import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BankAccount from "./Account";
import ApiConfig from "../Misc/ApiBaseUrl";

const Dashboard = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = ApiConfig.getBaseUrl();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/");
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/account`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAccounts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
          navigate("/");
        }
      }
    };

    fetchAccounts();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {accounts.length > 0 ? (
        <div className="accounts">
          {accounts.map((account) => (
            <BankAccount key={account.id} account={account} />
          ))}
        </div>
      ) : (
        <p>No bank accounts available.</p>
      )}
    </div>
  );
};

export default Dashboard;
