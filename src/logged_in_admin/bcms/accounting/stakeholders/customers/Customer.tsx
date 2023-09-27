import { useState } from "react";
import { Tab } from "../../../../../Tab";
import { CopiedInvoices } from "../../invoices/customer-invoices/CopiedInvoices";
import CustomerReceipts from "../../receiprs-payments/receipts-customers/CustomerReceipts";
import Toolbar2 from "../../../../shared/Toolbar2";
import { IconButton } from "@mui/material";
import FiberSmartRecordIcon from "@mui/icons-material/FiberSmartRecord";
import CustomerCreditNotes from "../../returns-credit-notes/customer-credit-notes/CustomerCreditNotes";
import CustomerBalance from "../../reports-customers/customer-balance/CustomerBalance";
import { CustomerStatements } from "../../reports-customers/customer-statements/CustomerStatements";
import { CustomerTransaction } from "../../reports-customers/customer-transactions/CustomerTransaction";

export const Customer = () => {
  const [activeTab, setActiveTab] = useState("invoices");

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
              uk-tooltip="Transactions"
              className="uk-margin-right"
            >
              (T)
            </span>
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
            {activeTab === "credit-notes" && <CustomerCreditNotes />}
            {activeTab === "balance" && <CustomerBalance />}
            {activeTab === "statements" && <CustomerStatements />}
            {activeTab === "transaction" && <CustomerTransaction />}
          </div>
        </div>
      </div>
    </div>
  );
};
