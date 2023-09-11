import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import { IBodyCop, defaultBodyCop } from "../../../../../../../shared/models/bcms/BodyCorperate";
import { IUnit, defaultUnit } from "../../../../../../../shared/models/bcms/Units";
import { IFinancialYear, defaultFinancialYear } from "../../../../../../../shared/models/yearModels/FinancialYear";
import showModalFromId, { hideModalFromId } from "../../../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../../../dialogs/Dialogs";
import { IInvoice } from "../../../../../../../shared/models/invoices/Invoices";
import { SuccessfulAction } from "../../../../../../../shared/models/Snackbar";
import Modal from "../../../../../../../shared/components/Modal";

interface ServiceDetails {
  description: string;
  price: number;
  total: number;
}

export const Invoicing = observer(() => {
  const { propertyId, id, yearId, monthId } = useParams();
  const { store, ui, api } = useAppContext();
  const navigate = useNavigate();
  const me = store.user.meJson;
  //current date
  const currentDate = new Date();
  const currentDate1 = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(currentDate1);

  // generate invoice number
  const [invoiceNumber, setInvoiceNumber] = useState("");
  useEffect(() => {
    // Generate the invoice number
    const generateInvoiceNumber = () => {
      const randomNumber = Math.floor(Math.random() * 10000);
      const formattedNumber = randomNumber.toString().padStart(4, "0");
      const generatedInvoiceNumber = `INV000${formattedNumber}`;
      setInvoiceNumber(generatedInvoiceNumber);
    };
    generateInvoiceNumber();
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

  useEffect(() => {
    const getData = async () => {
      if (!propertyId || !id || !yearId) {
        window.alert("Cannot find ");
      } else {
        await api.body.body.getAll();
        const property = store.bodyCorperate.bodyCop.getById(propertyId);
        setBody(property?.asJson);
        const unit = store.bodyCorperate.unit.getById(id);
        setUnit(unit?.asJson);
        const year = store.bodyCorperate.financialYear.getById(yearId);
        setYear(year?.asJson);
        if (!me?.property) return;
        await api.unit.getAll(me.property);
      }
    };
    getData();
  }, [
    api.body.body,
    api.unit,
    id,
    me?.property,
    monthId,
    propertyId,
    store.bodyCorperate.bodyCop,
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
      invoiceNumber: invoiceNumber,
      dateIssued: currentDate.toLocaleString(),
      dueDate: selectedDate,
      references: "",
      totalDue: totalPrice,
      serviceId: details,
      pop: "",
      confirmed: false,
      verified: false,
      monthId: "",
      reminder: false,
      reminderDate: "",
      totalPaid: 0,
    };
    try {
      if (!me?.property) return;
      await api.body.invoice.create(InvoiceData, me?.property);
      setLoadingInvoice(false);
    } catch (error) {
      console.log(error);
    }

    setInvoiceNumber("");
    setSelectedDate("");
    hideModalFromId(DIALOG_NAMES.BODY.CREATE_INVOICE);
    SuccessfulAction(ui);
  };

  // get inivoice data

  useEffect(() => {
    const getInvoice = async () => {
      if (!me?.property) return;
      await api.body.invoice.getAll(me?.property);
      if ((me.property, me.year))
        await api.body.copiedInvoice.getAll(me.property, me.year);
    };
    getInvoice();
  }, [api.body.copiedInvoice, api.body.invoice, me?.property, me?.year]);

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

  const onViewInvoiceCopied = async (invoice: string) => {
    const inv = store.bodyCorperate.copiedInvoices.all
      .filter((inv) => inv.asJson.invoiceId === invoice)
      .map((inv) => {
        return inv.asJson;
      });

    showModalFromId(DIALOG_NAMES.BODY.VIEW_RCURRING_INVOICE);
    setInv(inv);
  };

  const [status, setStatus] = useState(false);

  // verify invoice
  const verifyInvoice = (invoiceId: string) => {
    navigate(
      `/c/body/body-corperate/${propertyId}/${id}/${yearId}/${invoiceId}`
    );
  };
  const verifyInvoiceCopied = (invoiceId: string) => {
    navigate(
      `/c/body/body-corperate/copied/${propertyId}/${id}/${yearId}/${invoiceId}`
    );
  };

  const maxValue = store.bodyCorperate.invoice.all
    .filter(
      (invoice) =>
        invoice.asJson.propertyId === propertyId &&
        invoice.asJson.unitId === id &&
        invoice.asJson.yearId === yearId &&
        invoice.asJson.confirmed === status
    )
    .map((invoice) => invoice).length;

  return (
    <div>
      <div className="section-toolbar uk-margin">
        <h5
          className="section-heading uk-heading"
          style={{ textTransform: "uppercase" }}
        >
          Master Invoice
        </h5>
        <div className="controls">
          <div className="uk-inline">
            <button
              className="uk-button primary uk-text-left uk-align-left"
              onClick={createInvoice}
              disabled={maxValue === 1}
              style={{ background: maxValue ? "grey" : "#000c37" }}
            >
              Create Master Invoice
            </button>
          </div>
        </div>
      </div>
      <div className="uk-card uk-card-default uk-card-body uk-width-1-1@m">
        <table className="uk-table uk-table-small uk-table-divider">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Financial Year</th>
              <th>Date Issued</th>
              <th>Verification status</th>
              {/* <th>Confirm POP Upload</th> */}
              <th className="uk-text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {store.bodyCorperate.invoice.all
              .filter(
                (invoice) =>
                  invoice.asJson.propertyId === propertyId &&
                  invoice.asJson.unitId === id &&
                  invoice.asJson.yearId === yearId &&
                  invoice.asJson.confirmed === status
              )
              .map((invoice) => (
                <tr key={invoice.asJson.invoiceId}>
                  <td>{invoice.asJson.invoiceNumber}</td>
                  <td>{year?.year}</td>
                  <td>{invoice.asJson.dateIssued}</td>
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

                  <td className="uk-text-right">
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
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* copied invoices */}
      <h6
        className="section-heading uk-heading"
        style={{ textTransform: "uppercase", fontWeight: "600" }}
      >
        Invoices
      </h6>
      <div className="uk-card uk-card-default uk-card-body uk-width-1-1@m">
        <table className="uk-table uk-table-small uk-table-divider">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Financial Year</th>
              <th>Date Issued</th>
              <th>Due Date</th>
              <th className="uk-text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {store.bodyCorperate.copiedInvoices.all
              .sort(
                (a, b) =>
                  new Date(b.asJson.dateIssued).getTime() -
                  new Date(a.asJson.dateIssued).getTime()
              )
              .filter((inv) => inv.asJson.unitId === id)
              .map((invoice) => (
                <tr key={invoice.asJson.invoiceId}>
                  <td>{invoice.asJson.invoiceNumber}</td>
                  <td>{year?.year}</td>
                  <td>{invoice.asJson.dateIssued}</td>
                  <td>{invoice.asJson.dueDate}</td>
                  <td className="uk-text-right">
                    <button
                      className="uk-button primary uk-margin-right"
                      onClick={() =>
                        onViewInvoiceCopied(invoice.asJson.invoiceId)
                      }
                    >
                      View More
                    </button>
                    <button
                      className="uk-button primary"
                      style={{ background: "orange" }}
                      onClick={() =>
                        verifyInvoiceCopied(invoice.asJson.invoiceId)
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
                <div className="uk-width-1-4@m">
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
                <div className="uk-width-1-4@m">
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
                <div className="uk-width-1-4@m">
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
                <div className="uk-width-1-4@m">
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
      <Modal modalId={DIALOG_NAMES.BODY.VIEW_RCURRING_INVOICE}>
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
