import { observer } from "mobx-react-lite";
import { useState, FormEvent, useEffect } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IDocumentCategory, defaultDocumentCategory } from "../../../shared/models/communication/documents/DocumentCategories";
import DIALOG_NAMES from "../Dialogs";
import { useNavigate } from "react-router-dom";

export const PromptUserDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const navigate = useNavigate();

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
        disabled={me?.lastName.length === 0 && me.firstName.length === 0}
      ></button>

      <h3 className="uk-modal-title">Kindly Update Your User Profile!</h3>
     <button className="uk-button primary"  onClick={() => navigate("/c/settings")}>Update Profile</button>
    </div>
  );
});
