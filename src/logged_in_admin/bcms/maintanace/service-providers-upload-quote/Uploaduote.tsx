// UploadQuote.jsx

import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import "./UploadQuote.scss"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import {
  getIconForExtensionExtra,
  updateWorkOrderById,
} from "../../../shared/common";
import { useParams } from "react-router-dom";
import Loading from "../../../../shared/components/Loading";
import {
  FailedAction,
  SuccessfulAction,
  SuccessfullQuotAction,
} from "../../../../shared/models/Snackbar";

export const UploadQuote = observer(() => {
  const { store, api, ui } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUp, setLoadingUp] = useState<boolean>(false);
  const { propertyId, maintenanceRequestId, workOrderId } = useParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const currentDate = Date.now();
  const convertedCurrent = new Date(currentDate).getTime();
  const orderWindowPeriod = store.maintenance.work_flow_order.getById(
    workOrderId || ""
  );

  const convertedWindowPeriod = new Date(
    orderWindowPeriod?.asJson.windowPeriod || ""
  ).getTime();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    setLoadingUp(true);

    if (selectedFile && workOrderId && propertyId && maintenanceRequestId) {
      try {
        await updateWorkOrderById(
          workOrderId,
          propertyId,
          maintenanceRequestId,
          [selectedFile]
        );
        SuccessfullQuotAction(ui);
      } catch (error) {
        console.log(error);
      }
    } else {
      // If the file is not selected, you can handle it here (e.g., show an error message).
      console.log("File is not selected");
      FailedAction(ui);
    }

    setLoadingUp(false);
    setSelectedFile(null);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (propertyId && maintenanceRequestId) {
        await api.maintenance.work_flow_order.getAll(
          propertyId,
          maintenanceRequestId
        );
      }
      setLoading(false);
    };
    getData();
  }, [api.maintenance.work_flow_order, maintenanceRequestId, propertyId]);

  useEffect(() => {
    // Clear the selected file after upload
    if (!loading) {
      setSelectedFile(null);
    }
  }, [loading]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {convertedCurrent < convertedWindowPeriod && (
            <div className="upload-quote-container quote uk-margin">
              <div className="upload-header">
                <h4 className="section-heading">Upload Quote</h4>
              </div>
              <div className="upload-content">
                <label className="file-input-label">
                  <input type="file" accept="*" onChange={handleFileChange} />
                  <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                  Choose a file
                </label>
                <button className="upload-button" onClick={handleUpload}>
                  Upload
                </button>
              </div>
              <div className="upload-preview">
                {selectedFile && (
                  <div>
                    <p>
                      Selected File:{" "}
                      {selectedFile ? selectedFile.name : "No file selected"}
                    </p>
                    <img
                      style={{ width: "4rem" }}
                      src={`${getIconForExtensionExtra(selectedFile.name)}`}
                      alt="File Preview"
                    />
                  </div>
                )}
                {loadingUp && <Loading />}
              </div>
            </div>
          )}

          {convertedCurrent > convertedWindowPeriod && (
            <div className="expired">
              <div className="container">
                <h1>Oops! Link Expired</h1>
                <p>The link you are trying to access has expired.</p>
                <br />
                <br />
                <br />
                <br />
                <div className="gif-container">
                  <img
                    src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif"
                    alt="Expired GIF"
                    width="200"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
});
