import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import {
  IDocumentCategory,
  defaultDocumentCategory,
} from "../../../../shared/models/communication/documents/DocumentCategories";

export const DocumentCategoryDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;

  const [documentCategory, setDocumentCategory] = useState<IDocumentCategory>({
    ...defaultDocumentCategory,
  });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API

    try {
      if (store.communication.documentCategory.selected) {
        const deptment = await api.communication.documentCategory.update(
          documentCategory,
          me.property
        );
        await store.communication.documentCategory.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "Document Folder updated!",
          type: "success",
        });
      } else {
        await api.communication.documentCategory.create(
          documentCategory,
          me.property
        );
        ui.snackbar.load({
          id: Date.now(),
          message: "Document Folder created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update Document Folder.",
        type: "danger",
      });
    }

    store.communication.documentCategory.clearSelected();
    setDocumentCategory({ ...defaultDocumentCategory });
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_DOCUMENT_CATEGORY);
  };

  const reset = () => {
    store.communication.documentCategory.clearSelected();
    setDocumentCategory({ ...defaultDocumentCategory });
  };

  useEffect(() => {
    if (store.communication.documentCategory.selected)
      setDocumentCategory(store.communication.documentCategory.selected);
    else setDocumentCategory({ ...defaultDocumentCategory });

    return () => {};
  }, [store.communication.documentCategory.selected]);

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
                Document Category Name
                {documentCategory.documentName === "" && (
                  <span style={{ color: "red" }}>*</span>
                )}
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Category Name"
                  value={documentCategory.documentName}
                  onChange={(e) =>
                    setDocumentCategory({
                      ...documentCategory,
                      documentName: e.target.value,
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
