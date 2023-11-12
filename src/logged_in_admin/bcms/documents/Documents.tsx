import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IDocumentCategory } from "../../../shared/models/communication/documents/DocumentCategories";
import showModalFromId from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../dialogs/Dialogs";
import folder from "./assets/folder_3139112.png";
import Modal from "../../../shared/components/Modal";
import { DocumentCategoryDialog } from "../../dialogs/communication-dialogs/documents/DocumentCategories";
import "./meeting-card.scss";
import Loading from "../../../shared/components/Loading";

export const Documents = observer(() => {
  const { api, store } = useAppContext();
  const me = store.user.meJson;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const folders = store.communication.documentCategory.all.map((f) => {
    return f.asJson;
  });

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_DOCUMENT_CATEGORY);
  };

  const onEdit = (documentCategory: IDocumentCategory) => {
    store.communication.documentCategory.select(documentCategory);
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_DOCUMENT_CATEGORY);
  };

  const toFolder = (documenrFolderId: string) => {
    navigate(`/c/communication/documents/${documenrFolderId}`);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (me?.property) {
        await api.communication.documentCategory.getAll(me.property);
      }
      setLoading(false);
    };
    getData();
  }, [api.communication.documentCategory, me?.property]);

  return (
    <div className="uk-section leave-analytics-page meeting-card">
      {loading ? (
        <Loading />
      ) : (
        <div className="uk-container uk-container-large">
          <div className="section-toolbar uk-margin">
            <h4 className="section-heading uk-heading">Document Folders</h4>
            <div className="controls">
              <div className="uk-inline">
                <button
                  onClick={onCreate}
                  className="uk-button primary"
                  type="button"
                >
                  Create Folder
                </button>
              </div>
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
                  <span style={{ fontSize: "11px" }}>{f.documentName}</span>
                </div>
              </div>
            ))}
            {folders.length === 0 && (
              <span style={{ color: "red" }}>No folders</span>
            )}
          </div>
        </div>
      )}
      <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_DOCUMENT_CATEGORY}>
        <DocumentCategoryDialog />
      </Modal>
    </div>
  );
});
