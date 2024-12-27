import React from "react";
import { Link } from "react-router-dom";
import "../Css/Account.css";

const Account = ({ account }) => {
  return (
    <div className="account">
      {/* Wrap the account name with a Link for navigation */}
      <h3>
        <Link to={`/account/${account.id}`} className="account-name-link">
          {account.name}
        </Link>
      </h3>
      <p>Account Number: {account.id}</p>
      <p>Balance: ${account.balance}</p>
    </div>
  );
};

export default Account;
