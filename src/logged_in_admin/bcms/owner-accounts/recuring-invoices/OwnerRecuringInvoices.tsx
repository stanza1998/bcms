import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import showModalFromId, {
  hideModalFromId,
} from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  FailedAction,
  SuccessfulAction,
} from "../../../../shared/models/Snackbar";
import {
  IPOP,
  IRecuringInvoice,
  defaultRecuringInvoice,
} from "../../../../shared/models/invoices/RecuringInvoices";
import { db, storage } from "../../../../shared/database/FirebaseConfig";
import { IUnit, defaultUnit } from "../../../../shared/models/bcms/Units";

export const OwnerRecuringInvoices = observer(() => {
  const { store, api, ui } = useAppContext();
  const me = store.user.meJson;
  const currentDate = new Date();
  const [date, setDate] = useState("");

  const getData = async () => {
    await api.body.recuringInvoice.getAll();
    await api.body.unit.getAll();
    await api.body.body.getAll();
  };

  useEffect(() => {
    const getData = async () => {
      await api.body.recuringInvoice.getAll();
      await api.body.unit.getAll();
      await api.body.body.getAll();
      await api.auth.loadAll();
    };
    getData();
  }, [api.auth, api.body.body, api.body.recuringInvoice, api.body.unit]);

  const units = store.bodyCorperate.unit.all
    .filter((unit) => unit.asJson.ownerId === me?.uid)
    .map((unit) => {
      return unit.asJson;
    });

  const myInvoices = store.bodyCorperate.recuringInvoice.all
    .filter((inv) => units.some((unit) => unit.id === inv.asJson.unitId))
    .map((inv) => {
      return inv;
    });

  // file upload
  const [uploadPOPView, setUploadPOPView] = useState<
    IRecuringInvoice | undefined
  >({
    ...defaultRecuringInvoice,
  });

  const onViewInvoicePanel = (invId: string) => {
    const invoice = store.bodyCorperate.recuringInvoice.getById(invId);
    setUploadPOPView(invoice?.asJson);
    showModalFromId(DIALOG_NAMES.OWNER.UPLOAD_RECURING_POP);
  };

  const disableDelete = async () => {
    try {
      if (uploadPOPView?.invoiceId) {
        const docRef = doc(db, "RecuringInvoices", uploadPOPView.invoiceId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const invoiceData = docSnapshot.data();

          // Check the "pop" array and update the "deletable" fields to false if true.
          const updatedPopArray = invoiceData.pop.map((popEntry: any) => {
            if (popEntry.deletable === true) {
              return { ...popEntry, deletable: false };
            }
            return popEntry;
          });

          // Update the document with the modified "pop" array.
          await setDoc(docRef, { ...invoiceData, pop: updatedPopArray });
        }
      }
    } catch (error) {
      console.error("Error disabling delete:", error);
    }
  };

  const [progress, setProgress] = useState(0);

  const uploadPOP = async (file: any) => {
    if (date) {
      try {
        if (uploadPOPView?.invoiceId) {
          const docRef = doc(db, "RecuringInvoices", uploadPOPView?.invoiceId);
          // Upload file to Firebase Storage with progress tracking
          const storageRef = ref(storage, `recuring-pop/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Get the upload progress percentage
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              // console.log("progress: ", progress);

              setProgress(progress);
            },
            (error) => {
              console.log("Error uploading file", error);
            },
            async () => {
              // Upload complete, get the download URL
              const downloadURL = await getDownloadURL(storageRef);
              const newRowData: IPOP = {
                date: date,
                pop: downloadURL,
                confirmed: false,
                deletable: true,
              };

              // Update POP field in Firestore document
              await updateDoc(docRef, {
                pop: arrayUnion(newRowData),
              });
              // await updateDoc(docRef, { pop: downloadURL });
              // Refresh the data
              // getInvoices();
              getData();

              setDate("");
              SuccessfulAction(ui);
              setProgress(0);
            }
          );
        } else {
          console.log("No id provided");
        }
      } catch (error) {
        console.log("Error uploading file", error);
      }
    } else {
      return ui.snackbar.load({
        id: Date.now(),
        message: "Please add date.",
        type: "danger",
      });
    }
  };

  //select file
  const [selectedFile, setSelectedFile] = useState(null);

  //remaing time
  const [remainingTime, setRemainingTime] = useState(0);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  //undo

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) {
        console.log("No file selected");
        return ui.snackbar.load({
          id: Date.now(),
          message: "Please select file.",
          type: "danger",
        });
      }

      // Your file upload logic here...
      await uploadPOP(selectedFile);
      setRemainingTime(60);

      // Reset the selectedFile state after a successful upload.
    } catch (error) {
      console.log("Error uploading file", error);
    }
  };

  // Function to decrement the remaining time every second
  const decrementRemainingTime = () => {
    setRemainingTime((prevTime) => prevTime - 1);
  };

  useEffect(() => {
    let interval: any;

    if (remainingTime === 1) {
      disableDelete(); // Execute the function when remainingTime becomes 1
    }
    if (remainingTime > 0) {
      interval = setInterval(decrementRemainingTime, 1000);
    }

    return () => clearInterval(interval);
  }, [disableDelete, remainingTime]);

  //
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are zero-based (0 to 11).
  const currentYear = currentDate.getFullYear();

  //messages

  const filteredInvoices = myInvoices.filter(
    (pop) => pop.asJson.invoiceId === uploadPOPView?.invoiceId
  );

  const isCurrentMonthUploaded = filteredInvoices.some((pop) =>
    pop.asJson.pop.some((popEntry) => {
      const entryDate = new Date(popEntry.date);
      const entryMonth = entryDate.getMonth() + 1;
      const entryYear = entryDate.getFullYear();
      return entryYear === currentYear && entryMonth === currentMonth;
    })
  );

  //delete
  const handleDeleteRow = async (index: number) => {
    try {
      if (uploadPOPView?.invoiceId) {
        // Get the Firestore reference to the recurring-invoices document
        const recurringInvoicesRef = doc(
          db,
          "RecuringInvoices",
          uploadPOPView?.invoiceId
        );

        // Get the current pop data from Firestore
        const snapshot = await getDoc(recurringInvoicesRef);
        const popData = snapshot.data()?.pop || [];

        // Remove the specified row (index) from the pop array
        popData.splice(index, 1);

        // Update the pop array in Firestore
        await updateDoc(recurringInvoicesRef, { pop: popData });
        return ui.snackbar.load({
          id: Date.now(),
          message: "Undoned",
          type: "primary",
        });
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  //view invoice

  const [inv, setInv] = useState<IRecuringInvoice | undefined>({
    ...defaultRecuringInvoice,
  });

  const [_unit, _setUnit] = useState<IUnit | undefined>({ ...defaultUnit });

  const onViewInvoice = (invoiceId: string, unitId: string) => {
    const invoice = store.bodyCorperate.recuringInvoice.getById(invoiceId);
    setInv(invoice?.asJson);
    const unit = store.bodyCorperate.unit.getById(unitId);
    _setUnit(unit?.asJson);
    showModalFromId(DIALOG_NAMES.BODY.VIEW_RCURRING_INVOICE);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4
            className="section-heading uk-heading"
            style={{ textTransform: "uppercase" }}
          >
            My Recuring Invoices
          </h4>
          <div className="controls">
            <div className="uk-inline">
              Date: {currentDate.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="uk-overflow-auto">
          <table className="uk-table uk-table-divider uk-table-small uk-table-responsive">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Property</th>
                <th>Unit</th>
                <th>Total Payment</th>
                <th>POP </th>
                <th>Action </th>
              </tr>
            </thead>
            <tbody>
              {myInvoices.map((inv) => (
                <tr key={inv.asJson.invoiceId}>
                  <td>{inv.asJson.invoiceNumber}</td>
                  <td>
                    {store.bodyCorperate.bodyCop.all
                      .filter(
                        (property) =>
                          property.asJson.id === inv.asJson.propertyId
                      )
                      .map((property) => {
                        return property.asJson.BodyCopName;
                      })}
                  </td>
                  <td>
                    {store.bodyCorperate.unit.all
                      .filter((unit) => unit.asJson.id === inv.asJson.unitId)
                      .map((unit) => {
                        return "Unit " + unit.asJson.unitName;
                      })}
                  </td>
                  <td>N$ {inv.asJson.totalPayment.toFixed(2)}</td>
                  <td>
                    <button
                      className="uk-button primary"
                      onClick={() => onViewInvoicePanel(inv.asJson.invoiceId)}
                    >
                      POP Panel
                    </button>
                  </td>
                  <td>
                    <button
                      className="uk-button primary"
                      style={{ background: "orange" }}
                      onClick={() =>
                        onViewInvoice(inv.asJson.invoiceId, inv.asJson.unitId)
                      }
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal modalId={DIALOG_NAMES.OWNER.UPLOAD_RECURING_POP}>
        <div
          className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog"
          style={{ width: "100%" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          <h3 className="uk-modal-title">
            POP Panel {uploadPOPView?.invoiceNumber}
          </h3>
          {isCurrentMonthUploaded ? (
            <p style={{ color: "green" }}>Current month pop is uploaded.</p>
          ) : (
            <p style={{ color: "red" }}>Current month pop is not uploaded.</p>
          )}
          <div>
            <input
              type="date"
              className="uk-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "30%" }}
            />
            <div className="uk-margin" uk-margin>
              <div data-uk-form-custom="target: true">
                <input type="file" onChange={handleFileChange} />
                <input
                  className="uk-input uk-form-width-medium"
                  type="text"
                  placeholder="Select file"
                  aria-label="Custom controls"
                  disabled
                />
              </div>
              <button
                className="uk-button uk-button-default"
                onClick={handleFileUpload}
                //   disabled={isLoading || !selectedFile}
              >
                Upload
              </button>
            </div>
            {progress > 0 && (
              <progress
                className="uk-progress"
                value={progress}
                max={100}
              ></progress>
            )}
          </div>

          <table className="uk-table uk-table-divider uk-table-small">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>POP</th>
                <th>Confirmation</th>
                <th className="uk-text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {myInvoices
                .filter(
                  (pop) => pop.asJson.invoiceId === uploadPOPView?.invoiceId
                )
                .map((pop) =>
                  pop.asJson.pop.map((popEntry, index: number) => {
                    return (
                      <tr key={index}>
                        <td>{index}</td>
                        <td>{popEntry.date}</td>
                        <td>
                          <a target="_blank" href={popEntry.pop}>
                            view
                          </a>
                        </td>
                        <td>
                          {popEntry.confirmed === false && (
                            <span
                              style={{
                                background: "red",
                                color: "white",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                paddingTop: "2px",
                                paddingBottom: "2px",
                                borderRadius: "2rem",
                              }}
                              className="uk-margin-small-right"
                            >
                              not confirmed
                            </span>
                          )}
                          {popEntry.confirmed === true && (
                            <span
                              style={{
                                background: "green",
                                color: "white",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                paddingTop: "2px",
                                paddingBottom: "2px",
                                borderRadius: "2rem",
                              }}
                              className="uk-margin-small-right"
                            >
                              confirmed
                            </span>
                          )}
                        </td>
                        <td className="uk-text-right">
                          <>
                            {popEntry.deletable === true ? (
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDeleteRow(index)}
                              >
                                <>{remainingTime}s</>
                                <span
                                  style={{ color: "red" }}
                                  data-uk-icon="trash"
                                ></span>
                              </div>
                            ) : (
                              <div
                                className="uk-button uk-button-default"
                                data-uk-tooltip="Delete disabled"
                              >
                                <span
                                  style={{ color: "grey" }}
                                  data-uk-icon="trash"
                                ></span>
                              </div>
                            )}
                          </>
                        </td>
                      </tr>
                    );
                  })
                )}
            </tbody>
          </table>
          {myInvoices
            .filter((pop) => pop.asJson.invoiceId === uploadPOPView?.invoiceId)
            .map(
              (pop) =>
                pop.asJson.pop.map((pop, index) => pop).length === 0 && (
                  <p>
                    No POP's uploaded for Invoice {uploadPOPView?.invoiceNumber}
                  </p>
                )
            )}
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.VIEW_RCURRING_INVOICE}>
        <div
          className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
          style={{ width: "100%" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            // onClick={onClear}
          ></button>
          <h3 className="uk-modal-title">{uploadPOPView?.invoiceNumber}</h3>
          <div className="uk-section leave-analytics-page">
            <div
              className="uk-container uk-container-large"
              style={{
                marginBottom: "10rem",
                border: "solid grey 3px",
                padding: "20px",
                margin: "30px",
                borderRadius: "6px",
              }}
            >
              <div className="section-toolbar uk-margin">
                <h4 className="section-heading uk-heading">
                  {inv?.invoiceNumber}
                </h4>
                <div className="controls">
                  <div className="uk-inline">
                    {/* <button
                        className="uk-button primary"
                        type="button"
                      >
                        Back
                      </button> */}
                  </div>
                </div>
              </div>
              <div className="uk-section">
                <div className="uk-container uk-container-meduim">
                  <div
                    className="uk-child-width-1-2@m uk-grid-small uk-grid-match"
                    data-uk-grid
                  >
                    <div>
                      <div className="uk-card-body">
                        <p
                          style={{
                            textTransform: "capitalize",
                            fontWeight: "800",
                          }}
                        >
                          {store.bodyCorperate.bodyCop.all
                            .filter(
                              (prop) => prop.asJson.id === inv?.propertyId
                            )
                            .map((prop) => {
                              return prop.asJson.BodyCopName;
                            })}{" "}
                          <br />
                          {store.bodyCorperate.bodyCop.all
                            .filter(
                              (prop) => prop.asJson.id === inv?.propertyId
                            )
                            .map((prop) => {
                              return prop.asJson.location;
                            })}{" "}
                          <br />
                          {store.bodyCorperate.unit.all
                            .filter((prop) => prop.asJson.id === inv?.unitId)
                            .map((prop) => {
                              return "Unit " + prop.asJson.unitName;
                            })}{" "}
                          <br />
                          {store.user.all
                            .filter((u) => u.asJson.uid === _unit?.ownerId)
                            .map((u) => {
                              return (
                                u.asJson.firstName + " " + u.asJson.lastName
                              );
                            })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="uk-card-body">
                        <div className="uk-text-right">
                          <img
                            style={{ width: "60%", height: "60%" }}
                            src={process.env.PUBLIC_URL + "/icon1.png"}
                            alt="Phlo"
                          />
                        </div>
                        <p
                          className="uk-text-right"
                          style={{
                            textTransform: "capitalize",
                            fontWeight: "800",
                          }}
                        >
                          {" "}
                          Number: {inv?.invoiceNumber} <br />
                          Date: {inv?.dateIssued} <br />
                          {/* Due Date: {inv?.dueDate} <br /> */}
                          Total Due: N$ {inv?.totalPayment.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <table className="uk-table uk-table-small uk-table-divider">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th className="uk-text-center">Price</th>
                        <th className="uk-text-right">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inv?.services.map((details, index) => (
                        <tr key={index}>
                          <td style={{ textTransform: "uppercase" }}>
                            {details.description}
                          </td>
                          <td className="uk-text-center">
                            N$ {details.price.toFixed(2)}
                          </td>
                          <td className="uk-text-right">
                            N$ {details.price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <hr />
              <div className="section-toolbar uk-margin">
                <div className="section-heading uk-heading">
                  <div>
                    {store.bodyCorperate.bodyCop.all
                      .filter((prop) => prop.asJson.id === inv?.propertyId)
                      .map((prop) => {
                        return "Bank Name:" + prop.asJson.bankName;
                      })}{" "}
                    <br />
                    {store.bodyCorperate.bodyCop.all
                      .filter((prop) => prop.asJson.id === inv?.propertyId)
                      .map((prop) => {
                        return "Account Name:" + prop.asJson.accountName;
                      })}{" "}
                    <br />
                    {store.bodyCorperate.bodyCop.all
                      .filter((prop) => prop.asJson.id === inv?.propertyId)
                      .map((prop) => {
                        return "Account Number:" + prop.asJson.accountNumber;
                      })}{" "}
                    <br />
                    {store.bodyCorperate.bodyCop.all
                      .filter((prop) => prop.asJson.id === inv?.propertyId)
                      .map((prop) => {
                        return "BranchName:" + prop.asJson.branchName;
                      })}{" "}
                    <br />
                    {store.bodyCorperate.bodyCop.all
                      .filter((prop) => prop.asJson.id === inv?.propertyId)
                      .map((prop) => {
                        return "Branch Code:" + prop.asJson.branchCode;
                      })}{" "}
                    <br />
                    {store.bodyCorperate.bodyCop.all
                      .filter((prop) => prop.asJson.id === inv?.propertyId)
                      .map((prop) => {
                        return "Account Style:" + prop.asJson.accountStyle;
                      })}{" "}
                    <br />
                    {store.bodyCorperate.bodyCop.all
                      .filter((prop) => prop.asJson.id === inv?.propertyId)
                      .map((prop) => {
                        return "SWIFT:" + prop.asJson.swift;
                      })}{" "}
                    <br />
                  </div>
                </div>
                <div className="controls">
                  <div className="uk-inline">
                    <div className="uk-text-right">
                      Total Discount: N$0.00 <br />
                      Total Exclusive: N$
                      {inv?.totalPayment.toFixed(2)} <br />
                      Total VAT: N$0.00
                      <br />
                      <hr />
                      Sub Total: N${inv?.totalPayment.toFixed(2)}
                      <hr />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
});
