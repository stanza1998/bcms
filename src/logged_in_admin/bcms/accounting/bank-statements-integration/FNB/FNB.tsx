import { useState } from "react";
import { FNBUploadState } from "./UploadStatement";
import { Allocatate } from "./Allocatate";
import { Tab } from "../../../../../Tab";

export const FNB = () => {
  const [activeTab, setActiveTab] = useState("upload-statement");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div>
      <div className="uk-margin">
        <div>
          <div
            style={{ padding: "10px" }}
            className="uk-margin  uk-card-default"
          >
            <Tab
              label="Upload Statement"
              isActive={activeTab === "upload-statement"}
              onClick={() => handleTabClick("upload-statement")}
            />
            <Tab
              label="Allocate Transactions"
              isActive={activeTab === "allocate"}
              onClick={() => handleTabClick("allocate")}
            />
          </div>
          <div className="tab-content">
            {activeTab === "upload-statement" && <FNBUploadState />}
            {activeTab === "allocate" && <Allocatate />}
          </div>
        </div>
      </div>
    </div>
  );
};
