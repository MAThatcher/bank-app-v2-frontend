import React from "react";

const Account = ({ account }) => {
//eventually format this to be a card and clicking on this bankaccount navigates to a dedicated account page based on the account.id
//that page can be where people can view transactions
  return (
    <div className="account">
      <h3>{account.name}</h3>
      <p>Account Number: {account.id}</p>
      <p>Balance: ${account.balance}</p>
    </div>
  );
};

export default Account;
