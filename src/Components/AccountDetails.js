import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "../Css/AccountDetails.css"; // Add relevant CSS
import ApiConfig from "../Misc/ApiBaseUrl";

const AccountDetails = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBaseUrl = ApiConfig.getBaseUrl();
  const transactionsPerPage = 5;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/");
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/account/${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch account details");
        }
        setAccount(response.data[0]);
      } catch (error) {
        console.error("Error fetching account details:", error);
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
          navigate("/");
        }
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/transaction/${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch transactions");
        }
        setTransactions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
    fetchTransactions();
  }, [accountId]);

  const handlePageChange = (direction) => {
    if (
      direction === "next" &&
      currentPage < Math.ceil(transactions.length / transactionsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="account-details">
      <h2>{account.name}</h2>
      <p>Account Number: {account.id}</p>
      <p>Balance: ${account.balance}</p>
      <p>Account Type: {account.type}</p>
      <p>Created At: {moment(account.created_date).format("MM/DD/YYYY")}</p>
      <p>Updated At: {moment(account.updated_date).format("MM/DD/YYYY")}</p>

      <h3>Transactions</h3>
      <div className="transactions-container">
        {currentTransactions.map((transaction) => (
          <div key={transaction.id} className="transaction">
            <p>
              {moment(transaction.date).format("MM/DD/YYYY hh:mm:ss")} -{" "}
              {transaction.description} - ${transaction.amount}
            </p>
          </div>
        ))}
      </div>
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of{" "}
          {Math.ceil(transactions.length / transactionsPerPage)}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={
            currentPage === Math.ceil(transactions.length / transactionsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AccountDetails;
