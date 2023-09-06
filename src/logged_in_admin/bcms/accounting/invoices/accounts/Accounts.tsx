import React, { useState } from "react";
import { Tab } from "../../../../../Tab";

const Accounts = () => {
  const [activeTab, setActiveTab] = useState("Invoices");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Accounts</h4>
          <div className="controls">
            <div className="uk-inline"></div>
          </div>
        </div>
        <div>
          <div className="uk-margin">
            <Tab
              label="Accounts Transaction Report"
              isActive={activeTab === "Invoices"}
              onClick={() => handleTabClick("Invoices")}
            />
            <Tab
              label="General Ledger"
              isActive={activeTab === "gl"}
              onClick={() => handleTabClick("gl")}
            />
            <Tab
              label="Trial Balance"
              isActive={activeTab === "tb"}
              onClick={() => handleTabClick("tb")}
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
