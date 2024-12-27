import React from "react";
import "../Css/Account.css"

const Account = ({ account }) => {
  return (
    <div className="account">
      <h3>{account.name}</h3>
      <p>Account Number: {account.id}</p>
      <p>Balance: ${account.balance}</p>
    </div>
  );
};

export default Account;
