import { observer } from "mobx-react-lite";
import {
  Dispatch,
  SetStateAction,
  FormEvent,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../shared/functions/Context";
import useUploadToStorage from "../../../../logged_in_client/shared/hooks/useUploadToStorage";
import {
  IDocumentFile,
  defaultDocumentFile,
} from "../../../../shared/models/communication/documents/DocumentFiles";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import { DocumentFileForm } from "./DocumentFileForm";

export const DocumentFileDialog = observer(() => {
  const { store, api, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { uploadFile, progress } = useUploadToStorage();
  const currentDate = Date.now();
  const dateCreated = new Date(currentDate).toUTCString();
  const [src, setSrc] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [_progress, setProgress] = useState(0);
  const me = store.user.meJson;
  const { documenrFolderId } = useParams();

  const [documentFile, setDocumentFile] = useState<IDocumentFile>({
    ...defaultDocumentFile,
    dateCreated: dateCreated,
    fid: documenrFolderId || "",
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const $documentFile: IDocumentFile = {
      ...documentFile,
    };
    if (selectedFile) {
      const downloadURL = await uploadFile(selectedFile, `/documentFiles`);
      $documentFile.fileUrl = downloadURL;
    } else {
      $documentFile.fileUrl = "";
    }

    try {
      await api.communication.documentFile.create(
        $documentFile,
        me?.property || "",
        documenrFolderId || ""
      );
      store.communication.documentFile.load();
      ui.snackbar.load({
        id: Date.now(),
        message: "File uploaded successfully!",
        type: "success",
      });
    } catch (error) {
      console.log("Error creating", error);
    }

    setLoading(false);
    setDocumentFile({ ...defaultDocumentFile });
    store.communication.documentFile.clearSelected();
    setSrc("");
    hideModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_DOCUMENT_FILE);
  };

  const cleardocumentFile = () => {
    store.communication.documentFile.clearSelected();
    setSrc("");
  };

  //   useEffect(() => {
  //     if (store..selected) {
  //       setDocumentFile(store.documentFile.selected);
  //       setSrc(store.documentFile.selected.imgUrl);
  //     } else setDocumentFile({ ...defaultDocumentFile });
  //     console.log("Selected documentFile", documentFile);
  //     return () => {};
  //   }, [store.documentFile.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={cleardocumentFile}
      ></button>
      <DocumentFileForm
        documentFile={documentFile}
        setDocumentFile={setDocumentFile}
        onSubmit={onSubmit}
        loading={loading}
        src={src}
        setSrc={setSrc}
        setSelectedFile={setSelectedFile}
        progress={progress}
        setProgress={progress}
      />
    </div>
  );
});
