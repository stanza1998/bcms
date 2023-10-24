import React, { useState } from "react";
import { Tab } from "../../../../../Tab";
import { AccountsTransactions } from "../../accounts-transactions/AccountsTransactions";

const Accounts = () => {
  const [activeTab, setActiveTab] = useState("transactions");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div>
          <div
            style={{ padding: "10px" }}
            className="uk-margin  uk-card-default"
          >
            <span
              style={{
                fontSize: "16px",
                color: "#01aced",
                cursor: "not-allowed",
              }}
              uk-tooltip="Reports"
              className="uk-margin-right"
            >
              (R)
            </span>
            <Tab
              label="Accounts Transaction Report"
              isActive={activeTab === "transactions"}
              onClick={() => handleTabClick("transactions")}
            />
          </div>
          <div className="tab-content">
            {activeTab === "transactions" && <AccountsTransactions />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
