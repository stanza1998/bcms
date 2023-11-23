import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { AnnouncementDialog } from "../../../../dialogs/communication-dialogs/announcements/AnnouncementDialog";
import { ActiveAnnouncements } from "../../../communication/announcements/ActiveAnnouncements";
import { ExpiredAnnouncements } from "../../../communication/announcements/ExpiredAnnouncements";
import { Tab } from "../../../../../Tab";
import { AtciveNotices } from "./AtciveNotices";
import { ExpiredNotices } from "./ExpiredNotices";

export const Notices = observer(() => {
  const { api, store } = useAppContext();
  const me = store.user.meJson;

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG);
  };

  const [activeTab, setActiveTab] = useState("Active");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Notices</h4>
          <div className="controls">
            <div className="uk-inline">
              {me?.role !=="Owner" && (    <button className="uk-button primary" onClick={onCreate}>
                Create Notice
              </button>)}
            </div>
          </div>
        </div>
        <div>
          <div
            style={{ padding: "10px" }}
            className="uk-margin  uk-card-default"
          >
            <Tab
              label="Active Notices"
              isActive={activeTab === "Active"}
              onClick={() => handleTabClick("Active")}
            />
            <Tab
              label="Expired Notices"
              isActive={activeTab === "Expired"}
              onClick={() => handleTabClick("Expired")}
            />
          </div>
          <div className="tab-content">
            
            {activeTab === "Active" && <AtciveNotices />}
            {activeTab === "Expired" && <ExpiredNotices />}
            
          </div>
        </div>
  
      </div>
    </div>
  );
});
