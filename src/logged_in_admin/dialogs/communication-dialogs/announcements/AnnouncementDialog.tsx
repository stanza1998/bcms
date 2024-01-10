import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import {
  IAnnouncements,
  defaultAnnouncements,
} from "../../../../shared/models/communication/announcements/AnnouncementModel";
import { MAIL_ANNOUNCEMENTS } from "../../../shared/mailMessages";
import { findPropertyUsersEmails } from "../../../shared/common";
import Loading from "../../../../shared/components/Loading";
//import * as admin from "firebase-admin";

export const AnnouncementDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [_loading, _setLoading] = useState(false);
  const me = store.user.meJson;
  const currentDate = new Date();

  const users = store.user.all.map((u) => {
    return u.asJson;
  });
  const units = store.bodyCorperate.unit.all.map((u) => {
    return u.asJson;
  });

  const emails = findPropertyUsersEmails(users, units);

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
        announcement.dateAndTime = currentDate.toUTCString();

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
    //send emails to owners wuth units in that specific property.

    const { MY_SUBJECT, MY_BODY } = MAIL_ANNOUNCEMENTS(
      announcement.title,
      announcement.message
    );

    await api.mail.sendMail(
      "",
      ["engdesign@lotsinsights.com"],
      MY_SUBJECT,
      MY_BODY,
      ""
    );

    store.communication.announcements.clearSelected();
    setAnnouncement({ ...defaultAnnouncements });

    setLoading(false);
    hideModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG);
  };

  const reset = () => {
    store.communication.announcements.clearSelected();
  };

  useEffect(() => {
    if (store.communication.announcements.selected)
      setAnnouncement(store.communication.announcements.selected);
    else setAnnouncement({ ...defaultAnnouncements });

    return () => {};
  }, [store.communication.announcements.selected]);

  useEffect(() => {
    const getData = async () => {
      _setLoading(true);
      await api.auth.loadAll();
      if (me?.property) {
        await api.unit.getAll(me.property);
      }
      _setLoading(false);
    };
    getData();
  }, [api.unit, api.auth, me?.property]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        onClick={reset}
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Notice</h3>
      {_loading ? (
        <Loading />
      ) : (
        <div className="dialog-content uk-position-relative">
          <div className="reponse-form">
            <form className="uk-form-stacked" onSubmit={onSave}>
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Title
                  {announcement.title === "" && (
                    <span style={{ color: "red" }}>*</span>
                  )}
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
                  {announcement.message === "" && (
                    <span style={{ color: "red" }}>*</span>
                  )}
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
                  {announcement.dateAndTime === "" && (
                    <span style={{ color: "red" }}>*</span>
                  )}
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
                  {announcement.priorityLevel === "" && (
                    <span style={{ color: "red" }}>*</span>
                  )}
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
      )}
    </div>
  );
});
