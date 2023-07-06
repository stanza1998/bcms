import React from "react";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";

interface FileItemUploadingProps {
  fileName: string;
}

export const FileItemUploading = (props: FileItemUploadingProps) => {
  const { fileName } = props;

  return (
    <div>
      <div className="file-item uk-card-default uk-card-small uk-card-body">
        <span data-uk-icon="icon: file-text; ratio: 2"></span>
        {fileName}
        <div className="upload-progress-bar">
          <div className="progress"></div>
        </div>
        <div className="upload-progress-bar">
          <div className="progress"></div>
        </div>
      </div>
    </div>
  );
};

interface AttachedFileItemProps {
  fileName: string;
  fileURL: string;
  onDelete: (fileName: string) => Promise<void>;
  progress?: number;
}

const AttachedFileItem = (props: AttachedFileItemProps) => {
  const { fileName, fileURL, progress, onDelete } = props;
  const { store } = useAppContext();

  const readFile = async () => {
    // await store.fileViewer.select({ fileName, fileURL });
    showModalFromId("read-attached-dialog");
  };

  const deleteFile = () => {
    if (window.confirm("Do you want to delete file?")) onDelete!(fileName);
  };

  return (
    <div>
      <div className="file-item uk-card-default uk-card-small uk-card-body">
        <span data-uk-icon="icon: file-text; ratio: 2"></span>
        {fileName}
        <div className="controls">
          <button
            className="uk-margin-small-right"
            type="button"
            onClick={readFile}
          >
            <span data-uk-icon="icon: expand; ratio: 1.2"></span>
          </button>
          <a
            className="uk-margin-small-right"
            href={fileURL}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <span data-uk-icon="icon: download; ratio: 1.2"></span>
          </a>
          <button className="delete" type="button" onClick={deleteFile}>
            <span data-uk-icon="icon: trash; ratio: 1.2"></span>
          </button>
        </div>
        {progress && (
          <div className="upload-progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachedFileItem;
