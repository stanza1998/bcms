import React, { useState } from "react";
import { Tab } from "../../../../Tab";

const Hub = () => {
  const [activeTab, setActiveTab] = useState("gl");

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
        </div>
      </div>
    </div>
  );
};

export default Hub;
