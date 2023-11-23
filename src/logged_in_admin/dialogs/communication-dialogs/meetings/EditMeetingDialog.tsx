import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
import {
  getCustomUserEmail,
  getFileExtension,
  getIconForExtensionExtra,
  getFileName,
  getIconForExtension,
  getUsersEmail,
  isDateAfterCurrentDate,
  cannotEditMeeting,
} from "../../../shared/common";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  UploadTask,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../../shared/database/FirebaseConfig";
import { DeleteOutline as FileIcon } from "@mui/icons-material"; // Import Material-UI icons
import { IconButton } from "@mui/material"; // Import IconButton component from Material-UI

interface Attachment {
  file: File;
  name: string;
  extension: string;
}

export const EditMeetingDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const [folder, setFolder] = useState<string>("");
  const animatedComponents = makeAnimated();
  const [attachmentUploading, setAttachmentUploading] = useState<number>(0);

  const [meeting, setMeeting] = useState<IMeeting>({
    ...defaultMeeting,
    attachments: [],
  });

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: FileList = e.target.files;
      const newAttachments: Attachment[] = Array.from(files).map(
        (file: File) => {
          const fileNameParts = file.name.split(".");
          const extension = fileNameParts.pop()?.toLowerCase() || ""; // Extract and convert to lowercase
          return {
            file,
            name: file.name,
            extension: extension,
          };
        }
      );
      setAttachments([...attachments, ...newAttachments]);
    }
  };

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
      value: user.uid,
      label: user.firstName + " " + user.lastName,
    }))
    .filter((user) => user.value !== me?.uid);

  const emails = getUsersEmail(
    meeting.ownerParticipants.filter((id) => id !== me?.uid),
    store
  );

  const customEmails = getCustomUserEmail(meeting.externalParticipants, store);

  const customContact = store.communication.customContacts.all
    .map((u) => u.asJson)
    .map((user) => ({
      value: user.id,
      label: user.name,
    }))
    .filter((user) => user.value !== me?.uid);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadTasks: Promise<string>[] = attachments.map(
        async (attachment) => {
          const { file, name } = attachment;
          const storagePath = `meeting-attachments/${encodeURIComponent(
            meeting.title
          )}/${encodeURIComponent(name)}`;
          const storageChildRef = ref(storage, storagePath);

          // Upload file to storage and get download URL
          const uploadTask: UploadTask = uploadBytesResumable(
            storageChildRef,
            file
          );
          const snapshot = await uploadTask;

          // Get download URL after upload
          const downloadUrl = await getDownloadURL(storageChildRef);
          return downloadUrl;
        }
      );

      // Wait for all uploads to complete and get download URLs
      const attachmentUrls = await Promise.all(uploadTasks);

      // Create a new meeting object with updated attachment URLs
      const updatedMeeting: IMeeting = {
        ...meeting,
        attachments: [...meeting.attachments, ...attachmentUrls],
      };

      if (store.communication.meeting.selected && me?.property) {
        // If meeting is selected, update the existing meeting
        await api.communication.meeting.update(
          updatedMeeting,
          me.property,
          meeting.folderId
        );
        await store.communication.meeting.load();

        ui.snackbar.load({
          id: Date.now(),
          message: "Meeting updated!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to save Meeting.",
        type: "danger",
      });
    } finally {
      // Clear attachments and reset form state
      setAttachments([]);
      setLoading(false);
      hideModalFromId(DIALOG_NAMES.COMMUNICATION.EDIT_MEETING_DIALOG);
    }
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
        await api.communication.customContact.getAll(me.property);
      }
    };
    getFolders();
  }, [
    api.communication.customContact,
    api.communication.meetingFolder,
    me?.property,
  ]);

  return (
    <div
      className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-2-3@s uk-width-2-3@m uk-width-2-1@l"
      //   style={{ width: "80%" }}
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
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-grid-small" data-uk-grid>
              <div className="uk-width-1-1">
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
                    disabled={isDateAfterCurrentDate(meeting.startDateAndTime)}
                  />
                </div>
              </div>

              <div className="uk-width-1-2@s">
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
                    disabled={isDateAfterCurrentDate(meeting.startDateAndTime)}
                  />
                </div>
              </div>
              <div className="uk-width-1-2@s">
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
                    // disabled={isDateAfterCurrentDate(meeting.startDateAndTime)}
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
                    className="uk-textarea"
                    value={meeting.description}
                    onChange={(e) =>
                      setMeeting({
                        ...meeting,
                        description: e.target.value,
                      })
                    }
                    required
                    disabled={isDateAfterCurrentDate(meeting.startDateAndTime)}
                  />
                </div>
              </div>
              <div className="uk-width-1-2@s">
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
                    disabled={isDateAfterCurrentDate(meeting.startDateAndTime)}
                  />
                </div>
              </div>
              <div className="uk-width-1-2@s">
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
                    disabled={isDateAfterCurrentDate(meeting.startDateAndTime)}
                  />
                </div>
              </div>
              <div className="uk-width-1-1">
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
                    value={meeting.ownerParticipants.map((participantId) => {
                      const selectedContact = users.find(
                        (contact) => contact.value === participantId
                      );
                      return selectedContact
                        ? {
                            label: selectedContact.label,
                            value: selectedContact.value,
                          }
                        : null;
                    })}
                    isDisabled={isDateAfterCurrentDate(
                      meeting.startDateAndTime
                    )}
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
                    value={meeting.externalParticipants.map((participantId) => {
                      const selectedContact = customContact.find(
                        (contact) => contact.value === participantId
                      );
                      return selectedContact
                        ? {
                            label: selectedContact.label,
                            value: selectedContact.value,
                          }
                        : null;
                    })}
                    isDisabled={isDateAfterCurrentDate(
                      meeting.startDateAndTime
                    )}
                  />
                </div>
              </div>
              {/* display attachments */}
              {meeting.attachments.length === 0 ? (
                <span style={{ color: "red" }}>No Attachments</span>
              ) : (
                <div className="uk-width-1-1">
                  <table className="uk-table uk-table-small uk-table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Extension</th>
                        <th>File</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meeting.attachments.map((attachment, index) => {
                        const fileName = getFileName(attachment);
                        const extension = getFileExtension(attachment);
                        const icon = getIconForExtensionExtra(extension);

                        return (
                          <tr key={index}>
                            <td>{fileName}</td>
                            <td>{extension}</td>
                            <td>
                              <a
                                href={attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={icon}
                                  alt="File icon"
                                  width="24"
                                  height="24"
                                  style={{ cursor: "pointer" }}
                                />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="uk-width-1-1">
                <label className="uk-form-label" htmlFor="attachments">
                  Meeting Attachments
                </label>
                <div className="uk-form-controls">
                  <input
                    type="file"
                    id="attachments"
                    onChange={handleAttachmentChange}
                    multiple
                  />
                  {/* Display the list of selected attachments */}
                  <table className="uk-table uk-table-small uk-table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Extension</th>
                        <th>File</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attachments.map((a, index) => (
                        <tr key={index}>
                          <td>{a.name}</td>
                          <td>{a.extension}</td>
                          <td>
                            <img
                              src={getIconForExtension(a.extension)}
                              alt={`${a.name} icon`}
                              width="24"
                              height="24"
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="uk-margin">
              {attachmentUploading > 0 && (
                <>
                  <span className="uk-margin">Uploading files</span>
                  <progress
                    className="uk-progress"
                    value={attachmentUploading}
                    max={100}
                  ></progress>
                </>
              )}
            </div>

            <div className="footer uk-margin">
              <button className="uk-button secondary uk-modal-close">
                Close
              </button>
              {cannotEditMeeting(me?.role || "") && (
                <button className="uk-button secondary uk-modal-close">
                  Cancel
                </button>
              )}
              {cannotEditMeeting(me?.role || "") && (
                <button className="uk-button primary" type="submit">
                  Save
                  {loading && <div data-uk-spinner="ratio: .5"></div>}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

// const onSave = async (e: FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   setLoading(true);
//   if (!me?.property) return;
//   // Update API

//   try {
//     if (store.communication.meeting.selected) {
//       const deptment = await api.communication.meeting.update(
//         meeting,
//         me.property,
//         folder
//       );
//       await store.communication.meeting.load();
//       ui.snackbar.load({
//         id: Date.now(),
//         message: "Folder updated!",
//         type: "success",
//       });
//     } else {
//       meeting.folderId = folder;
//       meeting.organizer = me.uid;

//       await api.communication.meeting.create(meeting, me.property, folder);

//       // const { MY_SUBJECT, MY_BODY } = MAIL_PROJECT_TASK_ADDED(
//       //   me.displayName,
//       //   project.projectName,
//       //   "project"
//       // );

//       ui.snackbar.load({
//         id: Date.now(),
//         message: "Folder created!",
//         type: "success",
//       });
//     }
//   } catch (error) {
//     ui.snackbar.load({
//       id: Date.now(),
//       message: "Error! Failed to update Folder.",
//       type: "danger",
//     });
//   }

//   store.communication.meeting.clearSelected();
//   setMeeting({ ...defaultMeeting });
//   setLoading(false);
//   hideModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_DIALOG);
// };
