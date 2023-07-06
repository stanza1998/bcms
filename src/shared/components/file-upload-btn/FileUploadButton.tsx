import React, { ChangeEvent } from "react";

interface Props {
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  label: string;
  name: string;
}
const FileUploadButton = (props: Props) => {
  const { onFileChange, name, label } = props;
  return (
    <label
      className="uk-button secondary uk-margin-small"
      style={{ textTransform: "capitalize", borderRadius: 5 }}
    >
      <input
        type="file"
        accept=".doc,.docx,application/msword,.pdf/"
        name={name}
        id={`upload-${name}`}
        onChange={onFileChange}
        style={{ display: "none" }}
      />
      <span style={{ color: "inherit" }} data-uk-icon="icon: upload"></span>
      {label}
    </label>
  );
};

export default FileUploadButton;
