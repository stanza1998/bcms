import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Tab } from "../../../../Tab";
import { FNB } from "./FNB/FNB";
import { NEDBANK } from "./NEDBANK/NEDBank";

export const ExpenseTracking = observer(() => {
  const [activeTab, setActiveTab] = useState("fnb");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Upload Statements</h4>
          <div className="controls">
            <div className="uk-inline"></div>
          </div>
        </div>
        <div className="uk-margin">
          <div>
            <div
              style={{ padding: "10px" }}
              className="uk-margin  uk-card-default"
            >
              <Tab
                label="First National Bank"
                isActive={activeTab === "fnb"}
                onClick={() => handleTabClick("fnb")}
              />
              <Tab
                label="NEDBANK"
                isActive={activeTab === "ned"}
                onClick={() => handleTabClick("ned")}
              />
              <Tab
                label="Bank Windhoek"
                isActive={activeTab === "whk"}
                onClick={() => handleTabClick("whk")}
              />
            </div>
            <div className="tab-content">
              {activeTab === "fnb" && <FNB />}
              {activeTab === "ned" && <NEDBANK />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
