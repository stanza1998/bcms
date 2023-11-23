import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import { useEffect, useState } from "react";
import folder from "./assets/folder_3139112.png";
import "./folderStyles.scss";
import showModalFromId from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../dialogs/Dialogs";
import Modal from "../../../shared/components/Modal";
import { MeetingFolderDialog } from "../../dialogs/communication-dialogs/meetings/MeetingFolderDialog";
import { IMeetingFolder } from "../../../shared/models/communication/meetings/MeetingFolder";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../shared/components/Loading";
import { cannotCreateFolder } from "../../shared/common";

export const Meetings = observer(() => {
  const { api, store } = useAppContext();
  const me = store.user.meJson;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const folders = store.communication.meetingFolder.all
    .filter((folder) =>
      folder.asJson.folderName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((f) => f.asJson);

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_FOLDER);
  };

  const onEdit = (meetingFolder: IMeetingFolder) => {
    store.communication.meetingFolder.select(meetingFolder);
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_FOLDER);
  };

  const toFolder = (folderId: string) => {
    navigate(`/c/communication/meetings/${folderId}`);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (me?.property) {
        await api.communication.meetingFolder.getAll(me.property);
      }
      setLoading(false);
    };

    // Check if any of the dependencies have changed before calling getData
    if (
      me?.property !== undefined && // Check if me?.property is defined
      api.communication.meetingFolder !== undefined // Check if api.communication.meetingFolder is defined
    ) {
      getData();
    }
  }, [api.communication.meetingFolder, me?.property]);

  return (
    <div className="uk-section leave-analytics-page folderStyles">
      {loading ? (
        <Loading />
      ) : (
        <div className="uk-container uk-container-large">
          <div className="section-toolbar uk-margin">
            <h4 className="section-heading uk-heading">Meeting Folders</h4>
            <div className="controls">
              <div className="uk-inline">
                {cannotCreateFolder(me?.role || "") && (
                  <button
                    onClick={onCreate}
                    className="uk-button primary"
                    type="button"
                  >
                    Create Folder
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="uk-margin">
            <div className="uk-margin">Search Folder</div>
            <div className="uk-margin">
              <input
                className="uk-input"
                placeholder="Search for a folder"
                style={{ width: "60%" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div
            className="uk-child-width-1-6@m uk-grid-small uk-grid-match"
            data-uk-grid
          >
            {folders.map((f) => (
              <div
                // onDoubleClick={() => onEdit(f)}
                onClick={() => toFolder(f.id)}
                // data-uk-tooltip="double click"
                style={{ textAlign: "center" }}
              >
                <div className="uk-card uk-card-body">
                  <div className="image-container">
                    <img src={folder} />
                    <div className="icon-container"></div>
                  </div>
                  <span style={{ fontSize: "11px" }}>{f.folderName}</span>
                </div>
              </div>
            ))}
            {folders.length === 0 && (
              <span style={{ color: "red" }}>No folders</span>
            )}
          </div>
        </div>
      )}
      <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_FOLDER}>
        <MeetingFolderDialog />
      </Modal>
    </div>
  );
});
