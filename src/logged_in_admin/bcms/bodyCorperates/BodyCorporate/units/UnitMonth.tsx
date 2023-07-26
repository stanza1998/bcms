import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import { IUnit, defaultUnit } from "../../../../../shared/models/bcms/Units";
import { useNavigate, useParams } from "react-router-dom";
import {
  IFinancialYear,
  defaultFinancialYear,
} from "../../../../../shared/models/yearModels/FinancialYear";
import {
  IFinancialMonth,
  defaultFinancialMonth,
} from "../../../../../shared/models/monthModels/FinancialMonth";
import Loading from "../../../../../shared/components/Loading";
import folder from "./assets/folder (3).png";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../shared/models/bcms/BodyCorperate";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import Modal from "../../../../../shared/components/Modal";
import {
  IInvoice,
  defaultInvoice,
} from "../../../../../shared/models/invoices/Invoices";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../../shared/database/FirebaseConfig";
import { SuccessfulAction } from "../../../../../shared/models/Snackbar";

export const UnitMonth = observer(() => {
  const { store, api, ui } = useAppContext();
  const { propertyId, id, yearId, monthId } = useParams();
  const navigate = useNavigate();

  const [info, setInfo] = useState<IUnit | undefined>({
    ...defaultUnit,
  });

  useEffect(() => {
    const getData = async () => {
      if (!id) {
        window.alert("Cannot find ");
      } else {
        const unit = store.bodyCorperate.unit.getById(id);
        setInfo(unit?.asJson);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [api.auth, api.body.body, api.body.unit, id, store.bodyCorperate.unit]);

  const [property, setProperty] = useState<IBodyCop | undefined>({
    ...defaultBodyCop,
  });

  useEffect(() => {
    const getData = async () => {
      if (!propertyId) {
        window.alert("Cannot find ");
      } else {
        const unit = store.bodyCorperate.bodyCop.getById(propertyId);
        setProperty(unit?.asJson);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [api.auth, store.bodyCorperate.bodyCop, propertyId]);

  const [year, setYear] = useState<IFinancialYear | undefined>({
    ...defaultFinancialYear,
  });

  useEffect(() => {
    const getData = async () => {
      if (!yearId) {
        window.alert("Cannot find ");
      } else {
        const unit = store.bodyCorperate.financialYear.getById(yearId);
        setYear(unit?.asJson);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [api.auth, store.bodyCorperate.financialYear, yearId]);

  const [month, setMonth] = useState<IFinancialMonth | undefined>({
    ...defaultFinancialMonth,
  });

  useEffect(() => {
    const getData = async () => {
      if (!monthId) {
        window.alert("Cannot find ");
      } else {
        const unit = store.bodyCorperate.financialMonth.getById(monthId);
        setMonth(unit?.asJson);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [api.auth, monthId, store.bodyCorperate.financialMonth]);

  const [laoderS, setLoaderS] = useState(true);

  setTimeout(() => {
    setLoaderS(false);
  }, 1000);

  //tabs
  const [activeTab, setActiveTab] = useState("unitFinance");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  // navigate tabls
  const back = () => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}/${yearId}`);
  };
  const backToYear = () => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}`);
  };
  const backToUnit = () => {
    navigate(`/c/body/body-corperate/${propertyId}`);
  };
  const backToProperty = () => {
    navigate(`/c/body/body-corperate`);
  };

  return (
    <div className="uk-section leave-analytics-page">
      {laoderS ? (
        <Loading />
      ) : (
        <div className="uk-container uk-container-large">
          <div className="section-toolbar uk-margin">
            <p
              className="section-heading uk-heading"
              style={{ textTransform: "uppercase" }}
            >
              <span onClick={backToProperty} style={{ cursor: "pointer" }}>
                {" "}
                {property?.BodyCopName}{" "}
              </span>{" "}
              /{" "}
              <span onClick={backToUnit} style={{ cursor: "pointer" }}>
                {" "}
                Unit {info?.unitName}{" "}
              </span>{" "}
              / <span> Financial Records / </span>
              <span onClick={backToYear} style={{ cursor: "pointer" }}>
                {" "}
                {year?.year}{" "}
              </span>{" "}
              /
              <span onClick={back} style={{ cursor: "pointer" }}>
                {month?.month === 1 && <>JAN</>}
                {month?.month === 2 && <>FEB</>}
                {month?.month === 3 && <>MAR</>}
                {month?.month === 4 && <>APR</>}
                {month?.month === 5 && <>MAY</>}
                {month?.month === 6 && <>JUN</>}
                {month?.month === 7 && <>JUL</>}
                {month?.month === 8 && <>AUG</>}
                {month?.month === 9 && <>SEP</>}
                {month?.month === 10 && <>OCT</>}
                {month?.month === 11 && <>NOV</>}
                {month?.month === 12 && <>DEC</>}
              </span>
            </p>
            <div className="controls">
              <div className="uk-inline">
                <button
                  onClick={back}
                  className="uk-button primary"
                  type="button"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
          <div>
            <button
              className={`uk-button primary uk-margin-right ${
                activeTab === "unitFinance" ? "active" : ""
              }`}
              onClick={() => handleTabClick("unitFinance")}
            >
              Unit Finance Dashboard
            </button>
            <button
              className={`uk-button primary uk-margin-right ${
                activeTab === "invoicing" ? "active" : ""
              }`}
              onClick={() => handleTabClick("invoicing")}
            >
              Invoicing
            </button>
            <button
              className={`uk-button primary uk-margin-right ${
                activeTab === "expenseTracking" ? "active" : ""
              }`}
              onClick={() => handleTabClick("expenseTracking")}
            >
              Expense Tracking
            </button>
            <button
              className={`uk-button primary uk-margin-right ${
                activeTab === "audit" ? "active" : ""
              }`}
              onClick={() => handleTabClick("audit")}
            >
              Audit
            </button>
          </div>

          <div className="uk-margin">
            {activeTab === "unitFinance" && (
              // Content for Unit Finance Dashboard tab
              <div>
                <UnitMiniDashboard />
              </div>
            )}

            {activeTab === "invoicing" && (
              // Content for Invoicing tab
              <div>
                <Invoicing />
              </div>
            )}

            {activeTab === "expenseTracking" && (
              // Content for Expense Tracking tab
              <div>
                <ExpenseTracking />
              </div>
            )}

            {activeTab === "audit" && (
              // Content for Audit tab
              <div>
                <Audit />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

const UnitMiniDashboard = observer(() => {
  const { store, api, ui } = useAppContext();
  const { propertyId, id, yearId, monthId } = useParams();

  useEffect(() => {
    const getData = async () => {
      await api.body.invoice.getAll();
    };
    getData();
  }, [api.body.invoice]);

  const totalInvoices = store.bodyCorperate.invoice.all
    .filter(
      (inv) =>
        inv.asJson.yearId === yearId &&
        inv.asJson.monthId === monthId &&
        inv.asJson.propertyId === propertyId &&
        inv.asJson.unitId === id
    )
    .map((inv) => inv).length;

  const totalNotPaid = store.bodyCorperate.invoice.all
    .filter(
      (inv) =>
        inv.asJson.yearId === yearId &&
        inv.asJson.monthId === monthId &&
        inv.asJson.propertyId === propertyId &&
        inv.asJson.unitId === id &&
        inv.asJson.confirmed === false
    )
    .map((inv) => inv).length;

  const totalPaid = store.bodyCorperate.invoice.all
    .filter(
      (inv) =>
        inv.asJson.yearId === yearId &&
        inv.asJson.monthId === monthId &&
        inv.asJson.propertyId === propertyId &&
        inv.asJson.unitId === id &&
        inv.asJson.confirmed === true
    )
    .map((inv) => inv).length;

  return (
    <div className="dashboard">
      <h3
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "600" }}
      >
        Unit Finance Dashboard
      </h3>

      <h5
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "500" }}
      >
        Invoicing
      </h5>
      <div
        className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
        data-uk-grid
      >
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">{totalInvoices}</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Total Invoices
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">{totalNotPaid}</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Outstanding Invoices
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">{totalPaid}</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Paid Invoices
            </p>
          </div>
        </div>
      </div>
      <h5
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "500" }}
      >
        Expense Tracking
      </h5>
      <div
        className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
        data-uk-grid
      >
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Total Expenses
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Expense Categories
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Outstanding Payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

interface ServiceDetails {
  description: string;
  price: number;
  total: number;
}

const Invoicing = observer(() => {
  const { propertyId, id, yearId, monthId } = useParams();
  const { store, ui, api } = useAppContext();
  const navigate = useNavigate();
  //current date
  const currentDate = new Date();
  const currentDate1 = new Date().toISOString().slice(0, 10);

  const [selectedDate, setSelectedDate] = useState(currentDate1);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  // generate invoice number

  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    // Generate the invoice number
    const generateInvoiceNumber = () => {
      const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
      const formattedNumber = randomNumber.toString().padStart(4, "0"); // Pad the number with leading zeros if necessary
      const generatedInvoiceNumber = `INV000${formattedNumber}`; // Add the prefix "INV" to the number
      setInvoiceNumber(generatedInvoiceNumber); // Update the state with the generated invoice number
    };

    generateInvoiceNumber(); // Generate the invoice number when the component mounts

    // Clean up the effect (optional)
    return () => {
      // Any cleanup code if necessary
    };
  }, []);

  //getdata

  const [viewBody, setBody] = useState<IBodyCop | undefined>({
    ...defaultBodyCop,
  });
  const [unit, setUnit] = useState<IUnit | undefined>({
    ...defaultUnit,
  });
  const [year, setYear] = useState<IFinancialYear | undefined>({
    ...defaultFinancialYear,
  });
  const [month, setMonth] = useState<IFinancialMonth | undefined>({
    ...defaultFinancialMonth,
  });

  useEffect(() => {
    const getData = async () => {
      if (!propertyId || !id || !yearId || !monthId) {
        window.alert("Cannot find ");
      } else {
        await api.body.body.getAll();
        const property = store.bodyCorperate.bodyCop.getById(propertyId);
        setBody(property?.asJson);
        const unit = store.bodyCorperate.unit.getById(id);
        setUnit(unit?.asJson);
        const month = store.bodyCorperate.financialMonth.getById(monthId);
        setMonth(month?.asJson);
        const year = store.bodyCorperate.financialYear.getById(yearId);
        setYear(year?.asJson);
        await api.body.unit.getAll();
      }
    };
    getData();
  }, [
    api.body.body,
    api.body.unit,
    id,
    monthId,
    propertyId,
    store.bodyCorperate.bodyCop,
    store.bodyCorperate.financialMonth,
    store.bodyCorperate.financialYear,
    store.bodyCorperate.unit,
    yearId,
  ]);

  // invoice
  const createInvoice = () => {
    showModalFromId(DIALOG_NAMES.BODY.CREATE_INVOICE);
  };

  const [details, setDetails] = useState<ServiceDetails[]>([]);
  const totalPrice = details.reduce((sum, detail) => sum + detail.price, 0);

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);

  const addDetails = () => {
    // Create a new object with the retrieved values
    const newDetail: ServiceDetails = {
      description: description,
      price: price,
      total: total,
    };

    // Update the state by adding the new detail to the existing details array
    setDetails((prevDetails) => [...prevDetails, newDetail]);
    // Reset the input fields to their initial states
    setDescription("");
    setPrice(0);
    setTotal(0);
  };

  // submitting invoice
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const onSaveInvoice = async (e: any) => {
    e.preventDefault();
    setLoadingInvoice(true);
    const InvoiceData: IInvoice = {
      invoiceId: "",
      propertyId: propertyId || "",
      unitId: id || "",
      yearId: yearId || "",
      monthId: monthId || "",
      invoiceNumber: invoiceNumber,
      dateIssued: currentDate.toLocaleString(),
      dueDate: selectedDate,
      references: "",
      totalDue: totalPrice,
      serviceId: details,
      pop: "",
      confirmed: false,
      verified: false,
    };

    const docRef = doc(collection(db, "Invoices"));
    InvoiceData.invoiceId = docRef.id;
    await setDoc(docRef, InvoiceData, { merge: true });
    setLoadingInvoice(false);
    setInvoiceNumber("");
    setSelectedDate("");
    hideModalFromId(DIALOG_NAMES.BODY.CREATE_INVOICE);
    SuccessfulAction(ui);
  };

  
  // get inivoice data

  useEffect(() => {
    const getInvoice = async () => {
      await api.body.invoice.getAll();
    };
    getInvoice();
  }, [api.body.invoice]);

  const [inv, setInv] = useState<IInvoice[]>([]);

  const onViewInvoice = async (invoice: string) => {
    const inv = store.bodyCorperate.invoice.all
      .filter((inv) => inv.asJson.invoiceId === invoice)
      .map((inv) => {
        return inv.asJson;
      });

    showModalFromId(DIALOG_NAMES.BODY.VIEW_INVOICE);
    setInv(inv);
  };

  const [status, setStatus] = useState(false);

  const pending = () => {
    setStatus(false);
  };
  const paid = () => {
    setStatus(true);
  };

  // verify invoice
  const verifyInvoice = (invoiceId: string) => {
    navigate(
      `/c/body/body-corperate/${propertyId}/${id}/${yearId}/${monthId}/${invoiceId}`
    );
  };

  return (
    <div>
      <div className="section-toolbar uk-margin">
        <h5
          className="section-heading uk-heading"
          style={{ textTransform: "uppercase" }}
        >
          Invoicing
        </h5>
        <div className="controls">
          <div className="uk-inline">
            <button
              className="uk-button primary uk-text-left uk-align-left"
              onClick={createInvoice}
              style={{ background: "#000c37" }}
            >
              Create Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid uk-margin-left">
        <button className="uk-button primary uk-margin-right" onClick={pending}>
          Pending
        </button>
        <button className="uk-button primary" onClick={paid}>
          Paid
        </button>
      </div>

      <div>
        <table className="uk-table uk-table-small uk-table-divider">
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Unit</th>
              <th>Invoice Number</th>
              <th>Year</th>
              <th>Month</th>
              <th>Verification status</th>
              <th>Confirm POP Upload</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {store.bodyCorperate.invoice.all
              .filter(
                (invoice) =>
                  invoice.asJson.propertyId === propertyId &&
                  invoice.asJson.unitId === id &&
                  invoice.asJson.yearId === yearId &&
                  invoice.asJson.monthId === monthId &&
                  invoice.asJson.confirmed === status
              )
              .map((invoice) => (
                <tr key={invoice.asJson.invoiceId}>
                  <td>{viewBody?.BodyCopName}</td>
                  <td>{`Unit ${unit?.unitName}`}</td>
                  <td>{invoice.asJson.invoiceNumber}</td>
                  <td>{year?.year}</td>
                  <td>
                    {month?.month === 1 && <>JAN</>}
                    {month?.month === 2 && <>FEB</>}
                    {month?.month === 3 && <>MAR</>}
                    {month?.month === 4 && <>APR</>}
                    {month?.month === 5 && <>MAY</>}
                    {month?.month === 6 && <>JUN</>}
                    {month?.month === 7 && <>JUL</>}
                    {month?.month === 8 && <>AUG</>}
                    {month?.month === 9 && <>SEP</>}
                    {month?.month === 10 && <>OCT</>}
                    {month?.month === 11 && <>NOV</>}
                    {month?.month === 12 && <>DEC</>}
                  </td>
                  <td>
                    {invoice.asJson.verified === false && (
                      <span style={{ color: "orange" }}>
                        waiting for verification
                      </span>
                    )}
                    {invoice.asJson.verified === true && (
                      <span style={{ color: "green" }}>verified</span>
                    )}
                  </td>
                  <td>
                    {invoice.asJson.confirmed === false && (
                      <span style={{ color: "orange" }}>
                        waiting for confirmation
                      </span>
                    )}
                    {invoice.asJson.confirmed === true && (
                      <span style={{ color: "green" }}>POP confirmed</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="uk-button primary uk-margin-right"
                      onClick={() => onViewInvoice(invoice.asJson.invoiceId)}
                    >
                      View More
                    </button>
                    {invoice.asJson.verified === false && (
                      <button
                        className="uk-button primary"
                        style={{ background: "green" }}
                        onClick={() => verifyInvoice(invoice.asJson.invoiceId)}
                      >
                        Verify
                      </button>
                    )}
                    {invoice.asJson.verified === true && (
                      <>
                        <button
                          className="uk-button primary"
                          style={{ background: "orange" }}
                          onClick={() =>
                            verifyInvoice(invoice.asJson.invoiceId)
                          }
                        >
                          View Invoice
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    {invoice.asJson.pop && (
                      <a target="blank" href={invoice.asJson.pop}>
                        <span
                          data-uk-tooltip="view POP"
                          style={{ color: "green" }}
                          data-uk-icon="icon: file-text; ratio: 1"
                        ></span>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal modalId={DIALOG_NAMES.BODY.CREATE_INVOICE}>
        <div
          className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
          style={{ width: "100%" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>

          <h3 className="uk-modal-title">Create Invoice</h3>
          <div className="dialog-content uk-position-relative">
            <div className="reponse-form">
              <div className="uk-grid-small uk-child-width-1-1@m" data-uk-grid>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Property Name</label>
                    <div className="uk-form-controls">
                      <input
                        id="first-name"
                        className="uk-input uk-form-small"
                        type="text"
                        value={viewBody?.BodyCopName}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Unit</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
                        type="text"
                        value={`Unit ${unit?.unitName}`}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Invoice Number</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
                        type="text"
                        value={invoiceNumber}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Date</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
                        type="text"
                        value={` ${
                          currentDate.getMonth() + 1
                        }/${currentDate.getDate()}/${currentDate.getFullYear()}`}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Due Date</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
                        type="date"
                        min={currentDate1}
                        value={selectedDate}
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>
                </div>

                <h3 className="uk-modal-title">Total Due</h3>
                <p style={{ fontWeight: "600" }}>N$ {totalPrice.toFixed(2)}</p>

                <h3 className="uk-modal-title">Service(s) details</h3>
                <div className="uk-width-1-2@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Description</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
                        type="text"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="uk-width-1-2@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Price</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
                        type="text"
                        required
                        onChange={(e) => setPrice(Number(e.target.value))}
                        value={price}
                      />
                    </div>
                  </div>
                </div>

                {description && price > 0 && (
                  <div className="uk-width-1-2@m">
                    <div className="uk-margin">
                      <div className="uk-form-controls">
                        <button
                          className="uk-button primary"
                          onClick={addDetails}
                        >
                          Add To List
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <table className="uk-table uk-table-small uk-table-divider">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((details, index) => (
                      <tr key={index}>
                        <td style={{ textTransform: "uppercase" }}>
                          {details.description}
                        </td>
                        <td>N$ {details.price.toFixed(2)}</td>
                        <td>N$ {details.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="footer uk-margin">
                <button className="uk-button secondary uk-modal-close">
                  Cancel
                </button>
                <button className="uk-button primary" onClick={onSaveInvoice}>
                  Save
                  {loadingInvoice && <div data-uk-spinner="ratio: .5"></div>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal modalId={DIALOG_NAMES.BODY.VIEW_INVOICE}>
        <div
          className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
          style={{ width: "70%" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>

          {inv.map((inv) => (
            <>
              <h3 className="uk-modal-title">Invoice Details</h3>
              <div
                className="uk-child-width-1-2@m uk-grid-small uk-grid-match"
                data-uk-grid
              >
                <div>
                  <div className="uk-card-body">
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      Property Name: {viewBody?.BodyCopName}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      location: {viewBody?.location}
                    </p>

                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      Unit: {unit?.unitName}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      Owner:{" "}
                      {store.user.all
                        .filter((u) => u.asJson.uid === unit?.ownerId)
                        .map((u) => {
                          return u.asJson.firstName + " " + u.asJson.lastName;
                        })}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="uk-card-body">
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        textAlign: "end",
                        textTransform: "uppercase",
                      }}
                    >
                      Invoice Number: {inv.invoiceNumber}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        textAlign: "end",
                        textTransform: "uppercase",
                      }}
                    >
                      Date: {inv.dateIssued.toLocaleString()}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        textAlign: "end",
                        textTransform: "uppercase",
                      }}
                    >
                      Due Date: {inv.dueDate}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        textAlign: "end",
                        textTransform: "uppercase",
                      }}
                    >
                      Total Due: N$ {inv.totalDue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <table className="uk-table uk-table-small uk-table-divider">
                <thead>
                  <tr>
                    <th>DESCRIPTION</th>
                    <th className="uk-text-center">PRICE</th>
                    <th className="uk-text-right">TOTAL PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.serviceId.map((det, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        {det.description}
                      </td>
                      <td
                        className="uk-text-center"
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        N$ {det.price.toFixed(2)}
                      </td>
                      <td
                        className="uk-text-right"
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        N$ {det.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ))}
        </div>
      </Modal>
    </div>
  );
});

const ExpenseTracking = () => {
  return (
    <div>
      <h4>Expense Tracking</h4>
    </div>
  );
};
const Audit = () => {
  return (
    <div>
      <h4>Auditing</h4>
    </div>
  );
};
