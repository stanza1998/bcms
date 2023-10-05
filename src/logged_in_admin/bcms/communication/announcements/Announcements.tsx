import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import { AnnouncementDialog } from "../../../dialogs/communication-dialogs/announcements/AnnouncementDialog";
import AnnouncementGrid from "./grid/AnnouncementGrid";
import { useEffect } from "react";
import { ViewAnnouncementDialog } from "../../../dialogs/communication-dialogs/announcements/ViewAnnouncementDialog";

export const Announcements = observer(() => {
  const { api, store } = useAppContext();
  const me = store.user.meJson;

  const announcements = store.communication.announcements.all.map((a) => {
    return a.asJson;
  });

  const filteredAnnouncements = announcements.sort(
    (a, b) =>
      new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
  );

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG);
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year) {
        await api.communication.announcement.getAll(me.property, me.year);
      }
    };
    getData();
  }, []);

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
        {/* announcement table */}
        <AnnouncementGrid data={filteredAnnouncements} />
      </div>
      <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG}>
        <AnnouncementDialog />
      </Modal>
      <Modal modalId={DIALOG_NAMES.COMMUNICATION.VIEW_ANNOUNCEMENT_DIALOG}>
        <ViewAnnouncementDialog />
      </Modal>
    </div>
  );
});
