import { useState } from "react";
import { Tab } from "../../../../../Tab";
import { CopiedInvoices } from "../../invoices/customer-invoices/CopiedInvoices";
import CustomerReceipts from "../../receiprs-payments/receipts-customers/CustomerReceipts";

export const Customer = () => {
  const [activeTab, setActiveTab] = useState("invoices");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Customer</h4>
          <div className="controls">
            <div className="uk-inline"></div>
          </div>
        </div>
        <div>
          <div
            style={{ padding: "10px" }}
            className="uk-margin  uk-card-default"
          >
            <Tab
              label="Customer Tax Invoices"
              isActive={activeTab === "invoices"}
              onClick={() => handleTabClick("invoices")}
            />
            <Tab
              label="Customer Credit Notes"
              isActive={activeTab === "credit-notes"}
              onClick={() => handleTabClick("credit-notes")}
            />
            <Tab
              label="Customer Receipts"
              isActive={activeTab === "receipts"}
              onClick={() => handleTabClick("receipts")}
            />
            <Tab
              label="Customer Balance"
              isActive={activeTab === "balance"}
              onClick={() => handleTabClick("balance")}
            />
            <Tab
              label="Customer Statements"
              isActive={activeTab === "statements"}
              onClick={() => handleTabClick("statements")}
            />
            <Tab
              label="Customer Transaction"
              isActive={activeTab === "transaction"}
              onClick={() => handleTabClick("transaction")}
            />
          </div>
          <div className="tab-content">
            {activeTab === "invoices" && <CopiedInvoices />}
            {activeTab === "receipts" && <CustomerReceipts />}
          </div>
        </div>
      </div>
    </div>
  );
};
