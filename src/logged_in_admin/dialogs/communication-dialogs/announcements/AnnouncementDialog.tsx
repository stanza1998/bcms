import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import {
  IAnnouncements,
  defaultAnnouncements,
} from "../../../../shared/models/communication/announcements/AnnouncementModel";

export const AnnouncementDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const currentDate = new Date();

  const [announcement, setAnnouncement] = useState<IAnnouncements>({
    ...defaultAnnouncements,
  });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API

    try {
      if (store.communication.announcements.selected) {
        const deptment = await api.communication.announcement.update(
          announcement,
          me.property,
          me.year
        );
        await store.communication.announcements.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "Announcement updated!",
          type: "success",
        });
      } else {
        announcement.authorOrSender = me.uid;
        announcement.dateAndTime = currentDate.toLocaleTimeString();

        await api.communication.announcement.create(
          announcement,
          me.property,
          me.year
        );
        ui.snackbar.load({
          id: Date.now(),
          message: "Announcement created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update Announcement.",
        type: "danger",
      });
    }

    store.communication.announcements.clearSelected();
    setAnnouncement({ ...defaultAnnouncements });
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG);
  };

  useEffect(() => {
    if (store.communication.announcements.selected)
      setAnnouncement(store.communication.announcements.selected);
    else setAnnouncement({ ...defaultAnnouncements });

    return () => {};
  }, [store.communication.announcements.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Announcement</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Title
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Title"
                  value={announcement.title}
                  onChange={(e) =>
                    setAnnouncement({
                      ...announcement,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Message
              </label>
              <div className="uk-form-controls">
                <textarea
                  className="uk-input"
                  placeholder="Message"
                  value={announcement.message}
                  onChange={(e) =>
                    setAnnouncement({
                      ...announcement,
                      message: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Expiry Date
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Expiry Date"
                  type="date"
                  value={announcement.expiryDate}
                  onChange={(e) =>
                    setAnnouncement({
                      ...announcement,
                      expiryDate: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Priorty Level
              </label>
              <div className="uk-form-controls">
                <select
                  className="uk-input"
                  onChange={(e) =>
                    setAnnouncement({
                      ...announcement,
                      priorityLevel: e.target.value,
                    })
                  }
                >
                  <option value="">Select priority level</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className="footer uk-margin">
              <button className="uk-button secondary uk-modal-close">
                Cancel
              </button>
              <button className="uk-button primary" type="submit">
                Save
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});
