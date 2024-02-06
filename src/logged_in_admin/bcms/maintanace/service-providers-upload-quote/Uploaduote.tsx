// UploadQuote.jsx

import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import "./UploadQuote.scss"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import {
  getIconForExtensionExtra,
  getServiceProviderId,
  updateWorkOrderWithFiles,
} from "../../../shared/common";
import { useParams } from "react-router-dom";
import Loading from "../../../../shared/components/Loading";
// import {
//   FailedAction,
//   SuccessfullQuotAction,
// } from "../../../../shared/models/Snackbar";

export const UploadQuote = observer(() => {
  const { store, api, ui } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUp, setLoadingUp] = useState<boolean>(false);
  const { propertyId, maintenanceRequestId, workOrderId } = useParams();
  const currentDate = Date.now();
  const convertedCurrent = new Date(currentDate).getTime();
  const [serviceProviderCode, setServiceProviderCode] = useState<string>("");
  const orderWindowPeriod = store.maintenance.work_flow_order.getById(
    workOrderId || ""
  );

  console.log("code: ", serviceProviderCode);

  const serviceProviderId = getServiceProviderId(store, serviceProviderCode);

  const workOrder = orderWindowPeriod?.asJson;

  const convertedWindowPeriod = new Date(
    orderWindowPeriod?.asJson.windowPeriod || ""
  ).getTime();

  const [selectedQuote, setSelectedQuote] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedQuote(file);
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const images = Array.from(event.target.files);
      setSelectedImages(images);
    }
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      if (workOrder && selectedQuote && propertyId && maintenanceRequestId) {
        await updateWorkOrderWithFiles(
          workOrder,
          selectedQuote,
          selectedImages,
          serviceProviderId,
          serviceProviderCode,
          api,
          propertyId,
          maintenanceRequestId
        );
        setLoading(false);
      } else {
        // Handle the case where workOrder is undefined
        console.error("workOrder is undefined");
      }
    } catch (error) {}
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (propertyId && maintenanceRequestId) {
        await api.maintenance.work_flow_order.getAll(
          propertyId,
          maintenanceRequestId
        );

        await api.maintenance.service_provider.getAll(propertyId);
      }
      setLoading(false);
    };
    getData();
  }, [
    api.maintenance.service_provider,
    api.maintenance.work_flow_order,
    maintenanceRequestId,
    propertyId,
  ]);

  useEffect(() => {
    // Clear the selected file after upload
    if (!loading) {
      setSelectedQuote(null);
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
                <h4 className="section-heading">
                  Paste Shared Code (Ensure that no additional spaces are
                  entered before or after the code)
                </h4>
              </div>
              <div className="upload-content">
                <div className="uk-margin">
                  <input
                    className="uk-input"
                    onChange={(e: any) => {
                      // Remove spaces from the input value
                      const inputValue = e.target.value.replace(/\s/g, "");

                      // Update the state with the sanitized value
                      setServiceProviderCode(inputValue);
                    }}
                  />
                </div>

                <label className="file-input-label">
                  <input type="file" accept="*" onChange={handleFileChange} />
                  <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                  Choose a Quotation
                </label>
                <br />
                <br />
                <label className="file-input-label">
                  <input
                    type="file"
                    accept=".png, .jpg"
                    multiple
                    onChange={handleImageChange}
                  />
                  <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                  Choose Images
                </label>
                <button
                  disabled={loading}
                  onClick={handleUpload}
                  className="upload-button"
                >
                  Upload
                </button>
              </div>
              <div className="upload-preview">
                {selectedQuote && (
                  <div>
                    <p>
                      Selected File:{" "}
                      {selectedQuote ? selectedQuote.name : "No file selected"}
                    </p>
                    <img
                      style={{ width: "4rem" }}
                      src={`${getIconForExtensionExtra(selectedQuote.name)}`}
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
