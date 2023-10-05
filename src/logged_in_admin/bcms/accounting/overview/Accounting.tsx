import { useState } from "react";
import "./Accounting.scss";
import icon1 from "../assets/undraw_discount_d-4-bd.svg";
import icon2 from "../assets/undraw_investing_re_bov7.svg";
import icon3 from "../assets/undraw_segmentation_re_gduq.svg";
import icon4 from "../assets/undraw_setup_analytics_re_foim.svg";
import icon5 from "../assets/undraw_charts_re_5qe9.svg";
import { NormalLineGraph } from "../graphs/LineGraph";
import { PieChart } from "../graphs/PieChart";
import { Tab } from "../../../../Tab";
import { CustomerInvoicesOverview } from "./customer-invoices/CustomerInvoicesOverview";
import { SupplierInvoicesOverview } from "./supplier-invoices/SupplierInvoicesOverview";
// import ChartComponent, { PieChart } from "./graphs/PieChart";

export const Accounting = () => {
  const [activeTab, setActiveTab] = useState("Invoicing");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="uk-margin">
          <div>
            <div
              style={{ padding: "10px" }}
              className="uk-margin uk-card uk-card-default"
            >
              <Tab
                label="Customer Invoices"
                isActive={activeTab === "Invoicing"}
                onClick={() => handleTabClick("Invoicing")}
              />
              <Tab
                label="Supplier Invoices"
                isActive={activeTab === "Expense"}
                onClick={() => handleTabClick("Expense")}
              />
            </div>
            <div className="tab-content">
              {activeTab === "Invoicing" && <CustomerInvoicesOverview />}
              {activeTab === "Expense" && <SupplierInvoicesOverview />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


