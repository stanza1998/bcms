import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import showModalFromId, {
  hideModalFromId,
} from "../../../../shared/functions/ModalShow";
import {
  IInvoice,
  defaultInvoice,
} from "../../../../shared/models/invoices/Invoices";
import { db, storage } from "../../../../shared/database/FirebaseConfig";
import { collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { SuccessfulAction } from "../../../../shared/models/Snackbar";

export const OwnerInvoices = observer(() => {
  const { store, ui, api } = useAppContext();
  const currentDate = new Date();
  const navigate = useNavigate();

  const getInvoices = async () => {
    await api.body.invoice.getAll();
    await api.body.body.getAll();
    await api.body.unit.getAll();
    await api.body.financialYear.getAll();
    await api.body.financialMonth.getAll();
  };

  useEffect(() => {
    const getInvoices = async () => {
      await api.body.invoice.getAll();
      await api.body.body.getAll();
      await api.body.unit.getAll();
      await api.body.financialYear.getAll();
      await api.body.financialMonth.getAll();
    };
    getInvoices();
  }, [
    api.body.body,
    api.body.financialMonth,
    api.body.financialYear,
    api.body.invoice,
    api.body.unit,
  ]);

  const me = store.user.meJson;

  const myUnit = store.bodyCorperate.unit.all
    .filter((unit) => unit.asJson.ownerId === me?.uid)
    .map((unit) => {
      return unit.asJson.id;
    });

  const properties = store.bodyCorperate.bodyCop.all.map((body) => {
    return body.asJson;
  });
  const units = store.bodyCorperate.unit.all.map((unit) => {
    return unit.asJson;
  });

  const [financialYear, setFinancialYear] = useState("");
  const [financialMonth, setFinancialMonth] = useState("");

  const invoices = store.bodyCorperate.invoice.all
    .filter((inv) => myUnit.includes(inv.asJson.unitId))
    .filter((inv) => {
      if (financialYear !== "") {
        return inv.asJson.yearId === financialYear;
      }
      return true;
    })
    .filter((inv) => {
      if (financialMonth !== "") {
        return inv.asJson.monthId === financialMonth;
      }
      return true;
    })
    .map((inv) => inv.asJson);

  //view Invoice
  const verifyInvoice = (
    propertyId: string,
    id: string,
    yearId: string,
    monthId: string,
    invoiceId: string
  ) => {
    navigate(
      `/c/finance/invoices-view/${propertyId}/${id}/${yearId}/${monthId}/${invoiceId}`
    );
  };

  //upload POP

  const [uploadPOPView, setUploadPOPView] = useState<IInvoice | undefined>({
    ...defaultInvoice,
  });

  const onUploadPOP = (invId: string) => {
    const invoice = store.bodyCorperate.invoice.getById(invId);
    setUploadPOPView(invoice?.asJson);
    showModalFromId(DIALOG_NAMES.BODY.OWNER_UPLOAD_POP);
  };

  // upload function

  const [progress, setProgress] = useState(0);

  const uploadPOP = async (file: any) => {
    try {
      if (uploadPOPView?.invoiceId) {
        const docRef = doc(db, "Invoices", uploadPOPView?.invoiceId);
        // Upload file to Firebase Storage with progress tracking
        const storageRef = ref(storage, `pop/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get the upload progress percentage
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("progress: ", progress);

            setProgress(progress);
          },
          (error) => {
            console.log("Error uploading file", error);
          },
          async () => {
            // Upload complete, get the download URL
            const downloadURL = await getDownloadURL(storageRef);
            // Update POP field in Firestore document
            await updateDoc(docRef, { pop: downloadURL });
            // Refresh the data
            getInvoices();
            SuccessfulAction(ui);
            hideModalFromId(DIALOG_NAMES.BODY.OWNER_UPLOAD_POP);
            setProgress(0);
          }
        );
      } else {
        console.log("No id provided");
      }
    } catch (error) {
      console.log("Error uploading file", error);
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) {
        console.log("No file selected");
        return;
      }
      await uploadPOP(selectedFile);
      setSelectedFile(null);
    } catch (error) {
      console.log("Error uploading file", error);
    } finally {
      //   setLoading(false);
    }
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4
            className="section-heading uk-heading"
            style={{ textTransform: "uppercase" }}
          >
            My Invoices
          </h4>
          <div className="controls">Date: {currentDate.toLocaleString()}</div>
        </div>
        <div className="uk-inline uk-margin-right">
          <select
            name=""
            className="uk-input uk-form-small "
            id=""
            onChange={(e) => setFinancialYear(e.target.value)}
          >
            <option value="">filter by year</option>
            {store.bodyCorperate.financialYear.all.map((year) => (
              <option value={year.asJson.id} key={year.asJson.id}>
                {year.asJson.year}
              </option>
            ))}
          </select>
        </div>

        <div className="uk-inline uk-margin">
          <select
            name=""
            className="uk-input uk-form-small"
            id=""
            onChange={(e) => setFinancialMonth(e.target.value)}
          >
            <option value="">filter by month</option>
            {store.bodyCorperate.financialMonth.all
              .filter((month) => month.asJson.yearId === financialYear)
              .map((month) => (
                <option value={month.asJson.id}>
                  {month.asJson.month === 1 && <>JAN</>}
                  {month.asJson.month === 2 && <>FEB</>}
                  {month.asJson.month === 3 && <>MAR</>}
                  {month.asJson.month === 4 && <>APR</>}
                  {month.asJson.month === 5 && <>MAY</>}
                  {month.asJson.month === 6 && <>JUN</>}
                  {month.asJson.month === 7 && <>JUL</>}
                  {month.asJson.month === 8 && <>AUG</>}
                  {month.asJson.month === 9 && <>SEP</>}
                  {month.asJson.month === 10 && <>OCT</>}
                  {month.asJson.month === 11 && <>NOV</>}
                  {month.asJson.month === 12 && <>DEC</>}
                </option>
              ))}
          </select>
        </div>
        <div className="uk-overflow-auto">
          <table className="uk-table uk-table-divider uk-table-small uk-table-responsive">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice Number</th>
                <th>Property</th>
                <th>Unit</th>
                <th>POP uploaded</th>
                <th>Due Date</th>
                <th>Total Due</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .filter((inv) => inv.verified === true)
                .map((inv, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{inv.invoiceNumber}</td>
                    <td>
                      {properties
                        .filter((property) => property.id === inv.propertyId)
                        .map((property) => {
                          return property.BodyCopName;
                        })}
                    </td>
                    <td>
                      {" "}
                      {units
                        .filter((unit) => unit.id === inv.unitId)
                        .map((unit) => {
                          return "Unit " + unit.unitName;
                        })}
                    </td>
                    <td>
                      {inv.pop && (
                        <span style={{ color: "green" }}>
                          uploaded. waiting for confirmation{" "}
                          <span>
                            <a target="blank" href={inv.pop}>
                              (view)
                            </a>
                          </span>
                        </span>
                      )}
                      {inv.pop === "" && (
                        <span
                          style={{ color: "orange", cursor: "pointer" }}
                          onClick={() => onUploadPOP(inv.invoiceId)}
                        >
                          not uploaded (click here to upload)
                        </span>
                      )}
                    </td>
                    <td>{inv.dueDate}</td>
                    <td>N$ {inv.totalDue.toFixed(2)}</td>
                    <td>
                      {inv.confirmed === true && (
                        <span style={{ color: "green" }}>
                          payment confirmed by manager
                        </span>
                      )}
                      {inv.confirmed === false && (
                        <span style={{ color: "orange" }}>
                          payment not confirmed by manager
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="uk-button primary"
                        onClick={() =>
                          verifyInvoice(
                            inv.propertyId,
                            inv.unitId,
                            inv.yearId,
                            inv.monthId,
                            inv.invoiceId
                          )
                        }
                      >
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {invoices.filter((inv) => inv.verified === true).length === 0 && (
            <p style={{ color: "red" }}>No invoices</p>
          )}
        </div>
      </div>
      <Modal modalId={DIALOG_NAMES.BODY.OWNER_UPLOAD_POP}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            // onClick={onClear}
          ></button>
          <h3 className="uk-modal-title" style={{ textTransform: "uppercase" }}>
            Upload POP for invoice {uploadPOPView?.invoiceNumber}
          </h3>
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
      </Modal>
    </div>
  );
});
