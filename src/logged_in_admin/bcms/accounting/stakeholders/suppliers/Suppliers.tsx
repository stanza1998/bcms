import { observer } from "mobx-react-lite";
import { Tab } from "../../../../../Tab";
import SupplierPayment from "../../receiprs-payments/payments-suppliers/SupplierPayments";
import { SupplierInvoices } from "../../invoices/supplier-invoices/invoices/SupplierInvoices";
import { useState } from "react";
import { SupplierReturns } from "../../returns-credit-notes/supplier-returns/SupplierReturns";
import SupplierBalance from "../../reports-supplier/supplier-balance/SupplierBalance";
import { SupplierTransaction } from "../../reports-supplier/supplier-transactions/SupplierTransactions";
import { SupplierStatements } from "../../reports-supplier/supplier-statements/SupplierStatements";

export const SuppliersView = observer(() => {
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
              label="Supplier Tax Invoices"
              isActive={activeTab === "invoices"}
              onClick={() => handleTabClick("invoices")}
            />
            <Tab
              label="Supplier Returns"
              isActive={activeTab === "returns"}
              onClick={() => handleTabClick("returns")}
            />
            <Tab
              label="Supplier Payments"
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
              label="Supplier Balance"
              isActive={activeTab === "balance"}
              onClick={() => handleTabClick("balance")}
            />
            <Tab
              label="Supplier Statements"
              isActive={activeTab === "statements"}
              onClick={() => handleTabClick("statements")}
            />
            <Tab
              label="Supplier Transaction"
              isActive={activeTab === "transaction"}
              onClick={() => handleTabClick("transaction")}
            />
          </div>
          <div className="tab-content">
            {activeTab === "invoices" && <SupplierInvoices />}
            {activeTab === "receipts" && <SupplierPayment />}
            {activeTab === "returns" && <SupplierReturns />}
            {activeTab === "balance" && <SupplierBalance />}
            {activeTab === "statements" && <SupplierStatements />}
            {activeTab === "transaction" && <SupplierTransaction />}
          </div>
        </div>
      </div>
    </div>
  );
});
