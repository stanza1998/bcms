import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import {
  IMeeting,
  defaultMeeting,
} from "../../../../shared/models/communication/meetings/Meeting";
import SingleSelect from "../../../../shared/components/single-select/SlingleSelect";
import makeAnimated from "react-select/animated";
import Select from "react-select";

export const MeetingDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const [folder, setFolder] = useState<string>("");
  const animatedComponents = makeAnimated();

  const [meeting, setMeeting] = useState<IMeeting>({
    ...defaultMeeting,
  });

  const folders = store.communication.meetingFolder.all.map((f) => {
    return {
      label: f.asJson.folderName,
      value: f.asJson.id,
    };
  });

  const handleSelectFolder = (folderSelected: string) => {
    setFolder(folderSelected);
  };

  const users = store.user.all
    .map((u) => u.asJson)
    .map((user) => ({
      value: user.email,
      label: user.firstName + " " + user.lastName,
    }))
    .filter((user) => user.value !== me?.uid);

  const customContact = store.communication.customContacts.all
    .map((u) => u.asJson)
    .map((user) => ({
      value: user.email,
      label: user.name,
    }))
    .filter((user) => user.value !== me?.uid);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API

    try {
      if (store.communication.meeting.selected) {
        const deptment = await api.communication.meeting.update(
          meeting,
          me.property,
          folder
        );
        await store.communication.meeting.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "Folder updated!",
          type: "success",
        });
      } else {
        meeting.folderId = folder;
        meeting.organizer = me.uid;

        await api.communication.meeting.create(meeting, me.property, folder);
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

    store.communication.meeting.clearSelected();
    setMeeting({ ...defaultMeeting });
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_DIALOG);
  };

  const reset = () => {
    store.communication.meeting.clearSelected();
    setMeeting({ ...defaultMeeting });
  };

  useEffect(() => {
    if (store.communication.meeting.selected)
      setMeeting(store.communication.meeting.selected);
    else setMeeting({ ...defaultMeeting });

    return () => {};
  }, [store.communication.meeting.selected]);

  useEffect(() => {
    const getFolders = async () => {
      if (me?.property) {
        await api.communication.meetingFolder.getAll(me.property);
      }
    };
    getFolders();
  }, [api.communication.meetingFolder, me?.property]);

  return (
    <div
      className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
      style={{ width: "80%" }}
    >
      <button
        className="uk-modal-close-default"
        type="button"
        onClick={reset}
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Meeting</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked " onSubmit={onSave}>
            <div className="uk-grid-small" data-uk-grid>
              <div className="uk-width-1-2">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Meeting Title
                  {meeting.title === "" && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input"
                    type="text"
                    placeholder="Title"
                    value={meeting.title}
                    onChange={(e) =>
                      setMeeting({
                        ...meeting,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="uk-width-1-2">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Select Folder
                  {meeting.folderId === "" && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </label>
                <div className="uk-form-controls">
                  <SingleSelect
                    onChange={handleSelectFolder}
                    options={folders}
                  />
                </div>
              </div>
              <div className="uk-width-1-2">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Start Date And Time
                  {meeting.startDateAndTime === "" && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input"
                    type="datetime-local"
                    value={meeting.startDateAndTime}
                    onChange={(e) =>
                      setMeeting({
                        ...meeting,
                        startDateAndTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="uk-width-1-2">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  End Date And Time
                  {meeting.endDateAndTime === "" && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input"
                    type="datetime-local"
                    value={meeting.endDateAndTime}
                    onChange={(e) =>
                      setMeeting({
                        ...meeting,
                        endDateAndTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="uk-width-1-1">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Description
                  {meeting.description === "" && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </label>
                <div className="uk-form-controls">
                  <textarea
                    className="uk-input"
                    style={{ height: "6rem" }}
                    value={meeting.description}
                    onChange={(e) =>
                      setMeeting({
                        ...meeting,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="uk-width-1-2">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Location
                  {meeting.location === "" && (
                    <span style={{ color: "" }}> (optional)</span>
                  )}
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input"
                    type="text"
                    placeholder="Meeting Location"
                    value={meeting.location}
                    onChange={(e) =>
                      setMeeting({
                        ...meeting,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="uk-width-1-2">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Online Link
                  {meeting.meetingLink === "" && (
                    <span style={{ color: "" }}> (optional)</span>
                  )}
                </label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input"
                    type="text"
                    placeholder="Meeting Link"
                    value={meeting.meetingLink}
                    onChange={(e) =>
                      setMeeting({
                        ...meeting,
                        meetingLink: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="uk-width-1-2">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  System Attendees
                  {meeting.meetingLink === "" && (
                    <span style={{ color: "" }}> (optional)</span>
                  )}
                </label>
                <div className="uk-form-controls">
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={(value: any) =>
                      setMeeting({
                        ...meeting,
                        ownerParticipants: value.map((t: any) => t.value),
                      })
                    }
                    isMulti
                    placeholder="Search users"
                    options={users}
                  />
                </div>
              </div>
              <div className="uk-width-1-2">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Custom Created Attendees
                  {meeting.meetingLink === "" && (
                    <span style={{ color: "" }}> (optional)</span>
                  )}
                </label>
                <div className="uk-form-controls">
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={(value: any) =>
                      setMeeting({
                        ...meeting,
                        externalParticipants: value.map((t: any) => t.value),
                      })
                    }
                    isMulti
                    placeholder="Search users"
                    options={customContact}
                  />
                </div>
              </div>
              <div className="uk-width-1-1">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Custom Created Attendees
                  {meeting.meetingLink === "" && (
                    <span style={{ color: "" }}> (optional)</span>
                  )}
                </label>
                <div className="uk-form-controls">
                  <div className="uk-margin">
                    
                    <div data-uk-form-custom>
                      <input type="file" aria-label="Custom controls" />
                      <button
                        className="uk-button uk-button-default"
                        type="button"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
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
