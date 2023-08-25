import { useState } from "react";
import { Tab } from "../../../../Tab";
import { FNBStatements } from "./FNB/FNBStatements";

export const Statements = () => {
  const [activeTab, setActiveTab] = useState("FNB");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };
  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Statements</h4>
          <div className="controls">
            <div className="uk-inline">
              {/* <button
       
                className="uk-button primary"
                type="button"
              >
                Add Supplier
              </button> */}
            </div>
          </div>
        </div>
        <div className="uk-margin">
          <div>
            <div className="uk-margin">
              <Tab
                label="First National Bank"
                isActive={activeTab === "FNB"}
                onClick={() => handleTabClick("FNB")}
              />
              <Tab
                label="NEDBANK"
                isActive={activeTab === "nedbank"}
                onClick={() => handleTabClick("nedbank")}
              />
              <Tab
                label="Bank Windhoek"
                isActive={activeTab === "bwkh"}
                onClick={() => handleTabClick("bwkh")}
              />
            </div>
            <div className="tab-content">
              {activeTab === "FNB" && <FNBStatements />}
              {/* {activeTab === "Expense" && <Expense />} */}
              {/* {activeTab === "Expense" && <Expense />} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
