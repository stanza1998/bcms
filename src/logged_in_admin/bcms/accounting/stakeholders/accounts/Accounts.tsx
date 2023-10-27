import React, { useState } from "react";
import { AccountsTransactions } from "../../accounts-transactions/AccountsTransactions";

const Accounts = () => {


  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <AccountsTransactions />
      </div>
    </div>
  );
};

export default Accounts;
