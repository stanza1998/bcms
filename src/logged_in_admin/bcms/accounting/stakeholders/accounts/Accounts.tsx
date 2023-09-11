import React, { useState } from "react";
import { Tab } from "../../../../../Tab";

const Accounts = () => {
  const [activeTab, setActiveTab] = useState("li");

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
            <Tab
              label="List"
              isActive={activeTab === "li"}
              onClick={() => handleTabClick("li")}
            />
            <Tab
              label="Accounts Transaction Report"
              isActive={activeTab === "Invoices"}
              onClick={() => handleTabClick("Invoices")}
            />
          </div>
          <div className="tab-content">
            {/* {activeTab === "master" && <SupplierInvoices />} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
