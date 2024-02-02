import { observer } from "mobx-react-lite";
import {
  Dispatch,
  SetStateAction,
  FormEvent,
  ChangeEvent,
  useState,
} from "react";
import { IDocumentFile } from "../../../../shared/models/communication/documents/DocumentFiles";

interface IFormProps {
  documentFile: IDocumentFile;
  setDocumentFile: Dispatch<SetStateAction<IDocumentFile>>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  src: string;
  setSrc: Dispatch<SetStateAction<string>>;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  progress: number;
  setProgress: Number;
}

export const DocumentFileForm = observer((props: IFormProps) => {
  const [selected, setSelected] = useState<File | undefined>();

  const {
    onSubmit,
    documentFile,
    setDocumentFile,
    loading,
    setSelectedFile,
    src,
    setSrc,
    progress,
    setProgress,
  } = props;

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file =
      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    if (!file) return;
    setSelectedFile(file);
    setSelected(file);
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        const $src = reader.result?.toString() || "";
        setSrc($src);
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  return (
    <form onSubmit={onSubmit}>
      <legend className="uk-legend">Upload File</legend>
      <label className="thumbnail uk-margin">
        Select Image
        <img src={src} alt="" />
        <div className={`tools`}>
          <input className="d-none" type="file" onChange={onFileChange} />
        </div>
        {selected?.name}
      </label>
      <div className="uk-margin">
        <label>Document File Name</label>
        <br />
        <input
          className="uk-input uk-form-width-large "
          type="text"
          placeholder="Insurance Policy e.g"
          value={documentFile.documentFileName}
          onChange={(e) =>
            setDocumentFile({
              ...documentFile,
              documentFileName: e.target.value,
            })
          }
        />
      </div>
      <div>
        <label htmlFor="progress-bar">Current Progress is:</label>
        <progress value={progress} max="100" style={{marginLeft:"16px"}}></progress>
      </div>

      <div className="footer uk-margin">
        <button className="uk-button secondary uk-modal-close">Cancel</button>
        <button className="uk-button primary" type="submit">
          Save
          {loading && <div data-uk-spinner="ratio: .5"></div>}
        </button>
      </div>
    </form>
  );
});
