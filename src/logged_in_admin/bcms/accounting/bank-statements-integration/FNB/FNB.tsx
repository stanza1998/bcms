import { useEffect, useState } from "react";
import { FNBUploadState } from "./UploadStatement";
import { Allocatate } from "./Allocatate";
import { Tab } from "../../../../../Tab";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";

export const FNB = observer(() => {
  const { store, api } = useAppContext();
  const [activeTab, setActiveTab] = useState("upload-statement");
  const me = store.user.meJson;

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  const storeData = store.bodyCorperate.fnb.all;

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year && me?.month)
        await api.body.fnb.getAll(me.property, me.year, me.month);
    };
    getData();
  }, []);

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
});
