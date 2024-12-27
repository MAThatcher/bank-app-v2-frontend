import React from "react";
import { Link } from "react-router-dom";
import "../Css/Account.css";
import PropTypes from 'prop-types';


const Account = ({ account }) => {
  Account.propTypes = {
    account: PropTypes.string.isRequired
  };
  return (
    <div className="account">
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
