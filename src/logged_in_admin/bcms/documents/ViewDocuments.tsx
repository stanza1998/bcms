import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import showModalFromId from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../dialogs/Dialogs";
import { DocumentFileDialog } from "../../dialogs/communication-dialogs/documents/DocumentsDialog";
import Modal from "../../../shared/components/Modal";
import { IDocumentFile } from "../../../shared/models/communication/documents/DocumentFiles";
import {
  cannotCreateAttachDocuments,
  getIconForExtensionExtra,
} from "../../shared/common";
import Loading from "../../../shared/components/Loading";

export const ViewDocuments = observer(() => {
  const { api, store } = useAppContext();
  const me = store.user.meJson;
  const { documenrFolderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const _folder = store.communication.documentCategory.getById(
    documenrFolderId || ""
  );

  const _file = store.communication.documentFile.all
    .filter((f) => f.asJson.fid === documenrFolderId)
    .map((f) => {
      return f.asJson;
    });

  const sortedMeetings: IDocumentFile[] = _file.sort(
    (a, b) =>
      new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  );

  // Create an object to store grouped meetings by year and month
  const groupedMeetings: Record<string, IDocumentFile[]> = {};

  // Group meetings by year and month
  sortedMeetings.forEach((meeting) => {
    const year = new Date(meeting.dateCreated).getFullYear();
    const month = new Date(meeting.dateCreated).getMonth() + 1; // Month is zero-based, so add 1
    const key = `${year}-${month}`;

    if (!groupedMeetings[key]) {
      groupedMeetings[key] = [];
    }

    groupedMeetings[key].push(meeting);
  });

  const onCreateFile = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_DOCUMENT_FILE);
  };

  useEffect(() => {
    const getDocFolders = async () => {
      setLoading(true);
      if (me?.property && documenrFolderId) {
        await api.communication.documentCategory.getAll(me.property);
        await api.communication.documentFile.getAll(
          me?.property,
          documenrFolderId
        );
      }
      setLoading(false);
    };
    getDocFolders();
  }, [
    api.communication.documentFile,
    api.communication.documentCategory,
    documenrFolderId,
    me?.property,
  ]);

  const back = () => {
    navigate("/c/communication/documents");
  };

  return (
    <div className="uk-section leave-analytics-page">
      {loading ? (
        <Loading />
      ) : (
        <div className="uk-container uk-container-large">
          <div className="section-toolbar uk-margin">
            <h4 className="section-heading uk-heading">
              {_folder?.asJson.documentName} Folder
            </h4>
            <div className="controls">
              <div className="uk-inline">
                {cannotCreateAttachDocuments(me?.role || "") && (
                  <button
                    onClick={onCreateFile}
                    className="uk-button primary uk-margin-right"
                    type="button"
                  >
                    Attach New Document
                  </button>
                )}
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
          <div className="meeting-card">
            {Object.entries(groupedMeetings).map(([key, meetingsGroup]) => (
              <div key={key} className="uk-margin">
                <span className="uk-margin">
                  {new Date(key).toLocaleString("default", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
                <div
                  className="uk-child-width-1-6@m uk-grid-small uk-grid-match uk-margin"
                  data-uk-grid
                >
                  {meetingsGroup.map((meeting) => {
                    return (
                      <div
                      // onDoubleClick={() => onEdit(f)}
                      //   onClick={() => toFolder(f.id)}
                      // data-uk-tooltip="double click"
                      >
                        <div className="uk-card uk-card-body">
                          <div
                            className="image-container"
                            style={{ textAlign: "center" }}
                          >
                            <a target="blank" href={meeting.fileUrl}>
                              <img
                                src={getIconForExtensionExtra(meeting.fileUrl)}
                                alt="File Icon"
                              />
                            </a>
                            <div className="icon-container"></div>
                          </div>
                          <span
                            style={{ textAlign: "center", display: "block" }}
                          >
                            {meeting.documentFileName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_DOCUMENT_FILE}>
        <DocumentFileDialog />
      </Modal>
    </div>
  );
});
