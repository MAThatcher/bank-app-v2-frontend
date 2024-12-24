import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiConfig from "../Misc/ApiBaseUrl";

const Account = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = ApiConfig.getBaseUrl();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        const endpoint = `${baseUrl}/api/accounts/`;
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAccount(data.account);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;

  if (!account) return <div>Account not found</div>;

  return (
    <div>
      <h1>Account Details</h1>
      <h2>{account.name}</h2>
      <p>{account.description}</p>
      <p>
        <strong>Account ID:</strong> {account.id}
      </p>
      <p>
        <strong>Status:</strong> {account.status}
      </p>
      {/* Render more account details here */}
    </div>
  );
};

export default Account;
