import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tab } from "../../../../../../Tab";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { NEDBANKCreate } from "./NEDBANK";

export const CreateSupplierInvoice = observer(() => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("nedbank");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };
  const back = () => {
    navigate("/c/accounting/supplier-invoices");
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">
            Create Supplier Invoice
          </h4>
          <div className="controls">
            <div className="uk-inline">
              <button className="uk-button primary" onClick={back}>
                back
              </button>
            </div>
          </div>
        </div>
        <div className="uk-margin">
          <div>
            <div className="uk-margin">
              <Tab
                label="NEDBANK"
                isActive={activeTab === "nedbank"}
                onClick={() => handleTabClick("nedbank")}
              />
              <Tab
                label="First National Bank"
                isActive={activeTab === "fnb"}
                onClick={() => handleTabClick("fnb")}
              />
              <Tab
                label="Bank Windhoek"
                isActive={activeTab === "whk"}
                onClick={() => handleTabClick("whk")}
              />
            </div>
            <div className="tab-content">
              {activeTab === "nedbank" && <NEDBANKCreate />}
              {/* {activeTab === "fnb" && <FNBCreate />} */}
              {/* {activeTab === "whk" && <WHKCreate />} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});


