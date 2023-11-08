import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import showModalFromId from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../dialogs/Dialogs";
import Modal from "../../../shared/components/Modal";
import { MeetingDialog } from "../../dialogs/communication-dialogs/meetings/MeetingDialog";

export const ViewFolder = observer(() => {
  const { store, api } = useAppContext();
  const { folderId } = useParams();
  const navigate = useNavigate();
  const me = store.user.meJson;

  const _folder = store.communication.meetingFolder.getById(folderId || "");

  const back = () => {
    navigate("/c/communication/meetings");
  };

  const onCreateMeeting = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_DIALOG);
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property && folderId) {
        await api.communication.meetingFolder.getById(folderId, me.property);
      }
    };
    getData();
  }, [api.communication.meetingFolder, folderId, me?.property]);

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">
            {_folder?.asJson.folderName}
          </h4>
          <div className="controls">
            <div className="uk-inline">
              <button
                onClick={onCreateMeeting}
                className="uk-button primary uk-margin-right"
                type="button"
              >
                New Meeting
              </button>
              <button
                onClick={back}
                className="uk-button primary"
                type="button"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_DIALOG}>
        <MeetingDialog />
      </Modal>
    </div>
  );
});
