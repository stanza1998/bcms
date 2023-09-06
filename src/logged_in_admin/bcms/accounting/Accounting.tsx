import { useState } from "react";
import "./Accounting.scss";
import icon1 from "./assets/undraw_discount_d-4-bd.svg";
import icon2 from "./assets/undraw_investing_re_bov7.svg";
import icon3 from "./assets/undraw_segmentation_re_gduq.svg";
import icon4 from "./assets/undraw_setup_analytics_re_foim.svg";
import icon5 from "./assets/undraw_charts_re_5qe9.svg";
import { NormalLineGraph } from "./graphs/LineGraph";
import { PieChart } from "./graphs/PieChart";
import { Tab } from "../../../Tab";
// import ChartComponent, { PieChart } from "./graphs/PieChart";

export const Accounting = () => {
  const [activeTab, setActiveTab] = useState("Invoicing");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Accounting & Finance</h4>
          <div className="controls">
            <div className="uk-inline"></div>
          </div>
        </div>
        <div className="uk-margin">
          <div>
            <div className="uk-margin">
              <Tab
                label="Customer Invoices"
                isActive={activeTab === "Invoicing"}
                onClick={() => handleTabClick("Invoicing")}
              />
              <Tab
                label="SupplierInvoices"
                isActive={activeTab === "Expense"}
                onClick={() => handleTabClick("Expense")}
              />
            </div>
            <div className="tab-content">
              {activeTab === "Invoicing" && <Invoicing />}
              {activeTab === "Expense" && <Expense />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Invoicing = () => {
  //tabs

  const [activeTab, setActiveTab] = useState("normal");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };
  return (
    <div className="accounting">
      <div className="uk-margin">
        <h4
          style={{
            fontWeight: "800",
            color: "lightgrey",
            textTransform: "uppercase",
          }}
        >
          Key Matrics
        </h4>
        <div
          className="uk-child-width-1-4@m uk-grid-small uk-grid-match"
          data-uk-grid
        >
          <div>
            <div
              className="uk-card uk-card-default uk-card-body"
              style={{
                backgroundImage: `url(${icon2})`,
                backgroundPosition: "right",
                backgroundSize: "40%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h3 className="uk-card-title">Total Revenue</h3>
              <p className="uk-value">NAD 1 000 000.00</p>
            </div>
          </div>
          <div>
            <div
              className="uk-card uk-card-default uk-card-body"
              style={{
                backgroundImage: `url(${icon5})`,
                backgroundPosition: "right",
                backgroundSize: "40%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h3 className="uk-card-title">Outstanding Amount</h3>
              <p className="uk-value">NAD 56 000.00</p>
            </div>
          </div>
          <div>
            <div
              className="uk-card uk-card-default uk-card-body"
              style={{
                backgroundImage: `url(${icon3})`,
                backgroundPosition: "right",
                backgroundSize: "40%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h3 className="uk-card-title">Total Invoices</h3>
              <p className="uk-value"># 56</p>
            </div>
          </div>
          <div>
            <div
              className="uk-card uk-card-default uk-card-body"
              style={{
                backgroundImage: `url(${icon4})`,
                backgroundPosition: "right",
                backgroundSize: "40%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h3 className="uk-card-title">Overdue Invoices</h3>
              <p className="uk-value"># 20</p>
            </div>
          </div>
        </div>
      </div>
      <div className="uk-margin">
        <h4
          style={{
            fontWeight: "800",
            color: "lightgrey",
            textTransform: "uppercase",
          }}
        >
          Graphs & Charts
        </h4>
        <div className="uk-margin">
          <div>
            <div className="uk-margin">
              <Tab
                label="Revenue Trend"
                isActive={activeTab === "normal"}
                onClick={() => handleTabClick("normal")}
              />
              <Tab
                label="Invoice Status Distribution"
                isActive={activeTab === "recuring"}
                onClick={() => handleTabClick("recuring")}
              />
            </div>
            <div className="tab-content">
              {activeTab === "normal" && (
                <div
                  className="uk-card-extra uk-card-default uk-card-body uk-width-1-1@m"
                  style={{ height: "30rem" }}
                >
                  <NormalLineGraph />
                </div>
              )}
              {activeTab === "recuring" && (
                <div className="uk-card-extra uk-card-default uk-card-body uk-width-1-1@m">
                  <PieChart />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Expense = () => {
  return (
    <div>
      <h4
        style={{
          fontWeight: "800",
          color: "lightgrey",
          textTransform: "uppercase",
        }}
      >
        Expense Tracking
      </h4>
    </div>
  );
};
