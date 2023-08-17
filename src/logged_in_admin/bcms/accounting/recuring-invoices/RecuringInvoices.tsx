import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import { RecuringInvoicesDialog } from "../../../dialogs/recuring-invoices-dialog/RecuringInvoicesDialog";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import {
  IRecuringInvoice,
  defaultRecuringInvoice,
} from "../../../../shared/models/invoices/RecuringInvoices";
import Loading from "../../../../shared/components/Loading";
import { IUnit, defaultUnit } from "../../../../shared/models/bcms/Units";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../shared/database/FirebaseConfig";
import { SuccessfulAction } from "../../../../shared/models/Snackbar";

export const RecurringInvoices = observer(() => {
  const { store, api, ui } = useAppContext();
  const [invNumber, setInvNumber] = useState("");
  const [property, setInvProperty] = useState("");
  const [unit, setUnit] = useState("");

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.RECURING_INVOICE);
  };

  useEffect(() => {
    const getData = async () => {
      await api.body.recuringInvoice.getAll();
      await api.body.body.getAll();
      await api.body.financialMonth.getAll();
      await api.body.financialYear.getAll();
      await api.body.invoice.getAll();
      await api.body.unit.getAll();
      await api.auth.loadAll();
    };
    getData();
  }, [
    api.auth,
    api.body.body,
    api.body.financialMonth,
    api.body.financialYear,
    api.body.invoice,
    api.body.recuringInvoice,
    api.body.unit,
  ]);

  const invoices = store.bodyCorperate.recuringInvoice.all.map(
    (invoice) => invoice.asJson
  );

  const filteredInvoices = invoices.filter((invoice) => {
    // If all state variables are empty, display everything
    if (!invNumber && !property && !unit) {
      return true;
    }

    // Otherwise, apply the filter based on the state variables
    if (invNumber && invoice.invoiceNumber.includes(invNumber)) {
      return true;
    }

    if (property && invoice.propertyId === property) {
      return true;
    }

    if (unit && invoice.unitId === unit) {
      return true;
    }

    return false;
  });

  const [inv, setInv] = useState<IRecuringInvoice | undefined>({
    ...defaultRecuringInvoice,
  });

  const [_unit, _setUnit] = useState<IUnit | undefined>({ ...defaultUnit });

  const onShowInvoice = (invoiceId: string, unitId: string) => {
    const invoice = store.bodyCorperate.recuringInvoice.getById(invoiceId);
    setInv(invoice?.asJson);
    const unit = store.bodyCorperate.unit.getById(unitId);
    _setUnit(unit?.asJson);
    showModalFromId(DIALOG_NAMES.BODY.VIEW_RCURRING_INVOICE);
  };

  //pop

  const onViewPOPPanel = (invId: string) => {
    const invoice = store.bodyCorperate.recuringInvoice.getById(invId);
    setInv(invoice?.asJson);
    showModalFromId(DIALOG_NAMES.OWNER.UPLOAD_RECURING_POP);
  };

  const myInvoices = store.bodyCorperate.recuringInvoice.all.map((inv) => {
    return inv;
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are zero-based (0 to 11).
  const currentYear = currentDate.getFullYear();

  // const isCurrentMonthUploaded = myInvoices.some((pop) =>
  //   pop.asJson.pop.some((popEntry) => {
  //     const entryDate = new Date(popEntry.date);
  //     const entryMonth = entryDate.getMonth() + 1;
  //     const entryYear = entryDate.getFullYear();
  //     return entryYear === currentYear && entryMonth === currentMonth;
  //   })
  // );
  const isCurrentMonthUploaded = myInvoices.some(
    (pop) =>
      pop.asJson.invoiceId === inv?.invoiceId &&
      pop.asJson.pop.some((popEntry) => {
        const entryDate = new Date(popEntry.date);
        const entryMonth = entryDate.getMonth() + 1;
        const entryYear = entryDate.getFullYear();
        return entryYear === currentYear && entryMonth === currentMonth;
      })
  );

  //confirm POP

  const [isLoading, setIsLoading] = useState(false);

  const confirmPOP = async (index: number) => {
    if (inv?.invoiceId) {
      setIsLoading(true);
      const docRef = doc(db, "RecuringInvoices", inv?.invoiceId);

      // Fetch the document
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // Get the data of the document
        const data = docSnap.data();

        // Find the item in the 'pop' array with the given index
        const popArray = data.pop;
        const popItem = popArray[index];

        if (popItem) {
          // Update the 'confirmed' field to true
          popItem.confirmed = true;

          // Write the changes back to Firestore
          await updateDoc(docRef, {
            pop: popArray,
          });
          SuccessfulAction(ui);
        } else {
          console.log("Invalid index provided or 'pop' array is empty.");
        }
      } else {
        console.log("Document does not exist.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Recuring Invoices</h4>
          <div className="controls">
            <div className="uk-inline">
              <button
                className="uk-button primary"
                type="button"
                onClick={onCreate}
              >
                Create Recuring Invoice
              </button>
            </div>
          </div>
        </div>
        <div>
          <input
            type="text"
            className="uk-input uk-form-small uk-margin-right"
            placeholder="Search by Invoice Number"
            style={{ width: "30%" }}
            onChange={(e) => setInvNumber(e.target.value)}
          />
          <select
            className="uk-input uk-form-small uk-margin-right"
            placeholder="Search by Property"
            style={{ width: "30%" }}
            onChange={(e) => setInvProperty(e.target.value)}
          >
            <option value="">Select Property</option>
            {store.bodyCorperate.bodyCop.all.map((property) => (
              <option value={property.asJson.id}>
                {property.asJson.BodyCopName}
              </option>
            ))}
          </select>
          <select
            className="uk-input uk-form-small "
            placeholder="Search by Unit"
            style={{ width: "30%" }}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="">Select unit</option>
            {store.bodyCorperate.unit.all
              .filter((unit) => unit.asJson.bodyCopId === property)
              .map((unit) => (
                <option value={unit.asJson.id}>
                  Unit {unit.asJson.unitName}
                </option>
              ))}
          </select>
        </div>
        <table className="uk-table uk-table-divider uk-table-small">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Property</th>
              <th>Unit</th>
              <th>Amount</th>
              <th className="uk-text-right">Confirm POP</th>
              <th className="uk-text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((item) => (
              <tr key={item.invoiceId}>
                <td>{item.invoiceNumber}</td>
                <td>
                  {store.bodyCorperate.bodyCop.all
                    .filter((prop) => prop.asJson.id === item.propertyId)
                    .map((prop) => {
                      return prop.asJson.BodyCopName;
                    })}
                </td>
                <td>
                  {" "}
                  {store.bodyCorperate.unit.all
                    .filter((prop) => prop.asJson.id === item.unitId)
                    .map((prop) => {
                      return "Unit " + prop.asJson.unitName;
                    })}
                </td>
                <td>N$ {item.totalPayment.toFixed(2)}</td>
                <td className="uk-text-right">
                  <button
                    className="uk-button primary"
                    onClick={() => onViewPOPPanel(item.invoiceId)}
                  >
                    View POP's
                  </button>
                </td>
                <td className="uk-text-right">
                  <button
                    className="uk-button primary"
                    style={{ background: "orange" }}
                    onClick={() => onShowInvoice(item.invoiceId, item.unitId)}
                  >
                    View Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal modalId={DIALOG_NAMES.BODY.RECURING_INVOICE}>
        <RecuringInvoicesDialog />
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
          <h3 className="uk-modal-title">{inv?.invoiceNumber}</h3>
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
                      Total Exclusive: N${inv?.totalPayment.toFixed(2)} <br />
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
          {isLoading && (
            <span
              className="uk-margin-small-right"
              data-uk-spinner="ratio: 1"
            ></span>
          )}
          <h3 className="uk-modal-title">POP Panel {inv?.invoiceNumber}</h3>
          {isCurrentMonthUploaded ? (
            <p style={{ color: "green" }}>Current month pop is uploaded.</p>
          ) : (
            <p style={{ color: "red" }}>Current month pop is not uploaded.</p>
          )}

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
                .filter((pop) => pop.asJson.invoiceId === inv?.invoiceId)
                .map((pop) =>
                  pop.asJson.pop
                    .filter((pop) => !pop.deletable)
                    .map((popEntry, index: number) => {
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
                            {popEntry.confirmed === true && (
                              <span
                                className="uk-button uk-button-default"
                                data-uk-tooltip="POP Confirmed"
                                style={{ color: "grey" }}
                                data-uk-icon="play"
                              ></span>
                            )}
                            {popEntry.confirmed === false && (
                              <div
                                className="uk-button uk-button-default"
                                data-uk-tooltip="Confirm POP"
                                onClick={() => confirmPOP(index)}
                              >
                                <span
                                  style={{ color: "green" }}
                                  data-uk-icon="play"
                                ></span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                )}
            </tbody>
          </table>
          {myInvoices
            .filter((pop) => pop.asJson.invoiceId === inv?.invoiceId)
            .map(
              (pop) =>
                pop.asJson.pop.map((pop, index) => pop).length === 0 && (
                  <p>No POP's uploaded for Invoice {inv?.invoiceNumber}</p>
                )
            )}
        </div>
      </Modal>
    </div>
  );
});
