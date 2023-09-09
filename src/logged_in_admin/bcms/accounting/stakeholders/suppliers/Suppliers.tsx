import { observer } from "mobx-react-lite";
import { Tab } from "../../../../../Tab";
import SupplierPayment from "../../receiprs-payments/payments-suppliers/SupplierPayments";
import { SupplierInvoices } from "../../invoices/supplier-invoices/invoices/SupplierInvoices";
import { useState } from "react";
import { SupplierReturns } from "../../supplier-returns/SupplierReturns";

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
          </div>
        </div>
      </div>
    </div>
  );
});
