import React, { useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import { AnnouncementDialog } from "../../../dialogs/communication-dialogs/announcements/AnnouncementDialog";
import { observer } from "mobx-react-lite";
import { ActiveAnnouncements } from "./ActiveAnnouncements";
import { Tab } from "../../../../Tab";
import { ExpiredAnnouncements } from "./ExpiredAnnouncements";

export const Announcements = observer(() => {
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
          <h4 className="section-heading uk-heading">Announcements</h4>
          <div className="controls">
            <div className="uk-inline">
              <button className="uk-button primary" onClick={onCreate}>
                Create announcement
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            style={{ padding: "10px" }}
            className="uk-margin  uk-card-default"
          >
            <Tab
              label="Active Announcements"
              isActive={activeTab === "Active"}
              onClick={() => handleTabClick("Active")}
            />
            <Tab
              label="Expired Announcement"
              isActive={activeTab === "Expired"}
              onClick={() => handleTabClick("Expired")}
            />
          </div>
          <div className="tab-content">
            {activeTab === "Active" && <ActiveAnnouncements />}
            {activeTab === "Expired" && <ExpiredAnnouncements />}
          </div>
        </div>
        <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG}>
          <AnnouncementDialog />
        </Modal>
      </div>
    </div>
  );
});
