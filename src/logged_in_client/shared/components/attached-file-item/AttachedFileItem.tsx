import React from "react";
import showModalFromId from "../../../../shared/functions/ModalShow";

interface AttachedFileItemProps {
  fileName: string;
  fileURL: string;
  onDelete: (fileName: string) => Promise<void>;
  progress?: number;
}

const AttachedFileItem = (props: AttachedFileItemProps) => {
  const { fileName, fileURL, progress, onDelete } = props;
  // const { api, store } = useAppContext();

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
          <button className="uk-margin-small-right" onClick={readFile}>
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
          <button className="delete" onClick={deleteFile}>
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
