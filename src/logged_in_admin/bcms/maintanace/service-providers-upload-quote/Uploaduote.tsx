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
import SingleSelect from "../../../../shared/components/single-select/SlingleSelect";

export const UploadQuote = observer(() => {
  const { store, api, ui } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUp, setLoadingUp] = useState<boolean>(false);
  const { propertyId, maintenanceRequestId, workOrderId } = useParams();
  const currentDate = Date.now();
  const convertedCurrent = new Date(currentDate).getTime();
  const [serviceProvider, setServiceProvider] = useState<string>("");
  const orderWindowPeriod = store.maintenance.work_flow_order.getById(
    workOrderId || ""
  );

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

  const readFileAsync = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          resolve(event.target.result as string);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const serviceProviders = store.maintenance.servie_provider.all.map((s) => {
    return {
      label: s.asJson.serviceProvideName,
      value: s.asJson.id,
    };
  });

  const handleSelectSP = (id: string) => {
    setServiceProvider(id);
  };

  const handleUpload = async () => {
    setLoadingUp(true);

    if (selectedQuote && workOrderId && propertyId && maintenanceRequestId) {
      try {
        const quoteFileContent = await readFileAsync(selectedQuote);

        // Prepare the quote file data

        const quoteFileData = {
          id: serviceProvider, // You may generate a unique ID for the quote file
          quoteFileurl: quoteFileContent, // Assuming quoteFileurl should be the content of the file
          imageUrls: [], // Initialize as an empty array, as we're handling images separately
        };

        await updateWorkOrderById(
          workOrderId,
          propertyId,
          maintenanceRequestId,
          quoteFileData,
          selectedImages
        );

        SuccessfullQuotAction(ui);
      } catch (error) {
        console.log(error);
        FailedAction(ui);
      }
    } else {
      console.log("File or required parameters are not selected");
      FailedAction(ui);
    }

    setLoadingUp(false);
    setSelectedQuote(null);
    setSelectedImages([]);
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
                <h4 className="section-heading">Upload Quote</h4>
              </div>
              <div className="upload-content">
                <div className="uk-margin">
                  <SingleSelect
                    onChange={handleSelectSP}
                    options={serviceProviders}
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
                <button className="upload-button" onClick={handleUpload}>
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
