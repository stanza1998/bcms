import { useState } from "react";
import { Tab } from "../../../../Tab";
import { OwnerContacts } from "./owners-contacts/OwnerContacts";
import { SupplierContacts } from "./supplier-contacts/SupplierContacts";
import { CustomContacts } from "./custom-contacts/CustomContacts";

export const ContactOverview = () => {
  const [activeTab, setActiveTab] = useState("Owners");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };
  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Contact Management</h4>
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
              label="Owners Contacts"
              isActive={activeTab === "Owners"}
              onClick={() => handleTabClick("Owners")}
            />
            <Tab
              label="Supplier Contacts"
              isActive={activeTab === "Supplier"}
              onClick={() => handleTabClick("Supplier")}
            />
            <Tab
              label="Custom Contacts"
              isActive={activeTab === "Custom"}
              onClick={() => handleTabClick("Custom")}
            />
          </div>
          <div className="tab-content">
            {activeTab === "Owners" && <OwnerContacts />}
            {activeTab === "Supplier" && <SupplierContacts />}
            {activeTab === "Custom" && <CustomContacts />}
          </div>
        </div>
      </div>
    </div>
  );
};
