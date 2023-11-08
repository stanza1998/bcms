import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import {
  IMeetingFolder,
  defaultMeetingFolder,
} from "../../../../shared/models/communication/meetings/MeetingFolder";

export const MeetingFolderDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;

  const [meetingFolder, setMeetingFolder] = useState<IMeetingFolder>({
    ...defaultMeetingFolder,
  });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API

    try {
      if (store.communication.meetingFolder.selected) {
        const deptment = await api.communication.meetingFolder.update(
          meetingFolder,
          me.property
        );
        await store.communication.meetingFolder.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "Folder updated!",
          type: "success",
        });
      } else {
        await api.communication.meetingFolder.create(
          meetingFolder,
          me.property
        );
        ui.snackbar.load({
          id: Date.now(),
          message: "Folder created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update Folder.",
        type: "danger",
      });
    }

    store.communication.meetingFolder.clearSelected();
    setMeetingFolder({ ...defaultMeetingFolder });
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_FOLDER);
  };

  const reset = () => {
    store.communication.meetingFolder.clearSelected();
    setMeetingFolder({ ...defaultMeetingFolder });
  };

  useEffect(() => {
    if (store.communication.meetingFolder.selected)
      setMeetingFolder(store.communication.meetingFolder.selected);
    else setMeetingFolder({ ...defaultMeetingFolder });

    return () => {};
  }, [store.communication.meetingFolder.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        onClick={reset}
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Folder</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Folder Name
                {meetingFolder.folderName === "" && (
                  <span style={{ color: "red" }}>*</span>
                )}
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Folder Name"
                  value={meetingFolder.folderName}
                  onChange={(e) =>
                    setMeetingFolder({
                      ...meetingFolder,
                      folderName: e.target.value,
                    })
                  }
                  required
                />
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
