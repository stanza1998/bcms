import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import { AnnouncementDialog } from "../../../dialogs/communication-dialogs/announcements/AnnouncementDialog";
import AnnouncementGrid from "./grid/AnnouncementGrid";
import { useEffect } from "react";
import { ViewAnnouncementDialog } from "../../../dialogs/communication-dialogs/announcements/ViewAnnouncementDialog";

export const ActiveAnnouncements = observer(() => {
  const { api, store } = useAppContext();
  const me = store.user.meJson;
  const currentDate = new Date();

  const announcements = store.communication.announcements.all.map((a) => {
    return a.asJson;
  });

  const filteredAnnouncements = announcements
    .sort(
      (a, b) =>
        new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
    )
    .filter((announcement) => new Date(announcement.expiryDate) > currentDate);


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
