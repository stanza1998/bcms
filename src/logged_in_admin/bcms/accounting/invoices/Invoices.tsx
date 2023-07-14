import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import Modal from "../../../../shared/components/Modal";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import {
  IInvoice,
  defaultInvoice,
} from "../../../../shared/models/invoices/Invoices";
import showModalFromId from "../../../../shared/functions/ModalShow";
import {
  IFinancialMonth,
  defaultFinancialMonth,
} from "../../../../shared/models/monthModels/FinancialMonth";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../shared/models/bcms/BodyCorperate";
import { IUnit, defaultUnit } from "../../../../shared/models/bcms/Units";
import {
  IFinancialYear,
  defaultFinancialYear,
} from "../../../../shared/models/yearModels/FinancialYear";
import { useNavigate } from "react-router-dom";

export const Invoices = observer(() => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      await api.body.invoice.getAll();
      await api.body.unit.getAll();
      await api.body.financialYear.getAll();
      await api.body.financialMonth.getAll();
      await api.auth.loadAll();
    };
    getData();
  }, [
    api.auth,
    api.body.body,
    api.body.financialMonth,
    api.body.financialYear,
    api.body.invoice,
    api.body.unit,
  ]);

  const properties = store.bodyCorperate.bodyCop.all.map((inv) => {
    return inv.asJson;
  });

  const [propertyId, setPropertyId] = useState("");

  const getPropetyId = (pid: string) => {
    setPropertyId(pid);
  };

  const [yearFinancial, setYearFinancial] = useState("");
  const [monthFinancial, setMonthFinancial] = useState("");

  // const invoices = store.bodyCorperate.invoice.all
  //   .filter((inv) => {
  //     if (propertyId === "") return inv.asJson;
  //     else if (yearFinancial !== "")
  //       return (
  //         inv.asJson.yearId === yearFinancial &&
  //         inv.asJson.propertyId === propertyId
  //       );
  //     else if (monthFinancial !== "")
  //       return (
  //         inv.asJson.monthId === monthFinancial &&
  //         inv.asJson.propertyId === propertyId
  //       );
  //     else
  //       return (
  //         inv.asJson.yearId === yearFinancial &&
  //         inv.asJson.monthId === monthFinancial &&
  //         inv.asJson.propertyId === propertyId
  //       );
  //   })
  //   .map((inv) => {
  //     return inv.asJson;
  //   });

  const invoices = store.bodyCorperate.invoice.all;
  let filteredInvoices = invoices;

  // Step 1: Show all invoices

  // No additional code is required for this step since the invoices are initially stored in `filteredInvoices`.

  // Step 2: Filter by year

  if (yearFinancial !== "") {
    filteredInvoices = filteredInvoices.filter(
      (inv) => inv.asJson.yearId === yearFinancial
    );
  }

  // Step 3: Filter by month for the selected year

  if (monthFinancial !== "") {
    filteredInvoices = filteredInvoices.filter(
      (inv) => inv.asJson.monthId === monthFinancial
    );
  }

  // Step 4: Filter by property ID for the selected year and month

  if (propertyId !== "") {
    filteredInvoices = filteredInvoices.filter(
      (inv) => inv.asJson.propertyId === propertyId
    );
  }

  // Extract the 'asJson' property for the filtered invoices
  const result = filteredInvoices.map((inv) => inv.asJson);

  const [invoiceView, setInvoiceView] = useState<IInvoice | undefined>({
    ...defaultInvoice,
  });

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

  const viewInvoiceDetails = async (
    invoiceId: string,
    pid: string,
    uid: string,
    mid: string,
    yid: string
  ) => {
    const invoiceDetails = store.bodyCorperate.invoice.getById(invoiceId);
    setInvoiceView(invoiceDetails?.asJson);
    showModalFromId(DIALOG_NAMES.BODY.VIEW_INVOICE);
    await api.body.body.getAll();
    const property = store.bodyCorperate.bodyCop.getById(pid);
    setBody(property?.asJson);
    const unit = store.bodyCorperate.unit.getById(uid);
    setUnit(unit?.asJson);
    const month = store.bodyCorperate.financialMonth.getById(mid);
    setMonth(month?.asJson);
    const year = store.bodyCorperate.financialYear.getById(yid);
    setYear(year?.asJson);
    await api.body.unit.getAll();
  };

  //unit data

  const verifyInvoice = (
    invoiceId: string,
    propertyId: string,
    id: string,
    yearId: string,
    monthId: string
  ) => {
    navigate(
      `/c/body/body-corperate/${propertyId}/${id}/${yearId}/${monthId}/${invoiceId}/accounting-view`
    );
  };

  //

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Invoices</h4>
          <div className="controls">
            <div className="uk-inline"></div>
          </div>
        </div>
        <div>
          <select
            name=""
            className="uk-input uk-form-small uk-margin-right"
            id=""
            style={{ width: "40%" }}
            onChange={(e) => setYearFinancial(e.target.value)}
          >
            <option value="">Filter by Financial Year</option>
            {store.bodyCorperate.financialYear.all.map((year) => (
              <option value={year.asJson.id}>{year.asJson.year}</option>
            ))}
          </select>

          <select
            name=""
            className="uk-input uk-form-small uk-margin-left"
            id=""
            style={{ width: "40%" }}
            onChange={(e) => setMonthFinancial(e.target.value)}
          >
            <option value="">Filter by Financial Month</option>
            {store.bodyCorperate.financialMonth.all
              .filter((month) => month.asJson.yearId === yearFinancial)
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
          <br />
          <br />
          <div
            className="uk-position-relative uk-visible-toggle uk-light"
            data-uk-slider
          >
            <ul className="uk-slider-items uk-child-width-1-6 uk-child-width-1-6@m">
              <li>
                <div className="uk-panel">
                  <button
                    className="uk-button primary"
                    style={{ width: "85%" }}
                    onClick={() => getPropetyId("")}
                  >
                    All properties
                  </button>
                </div>
              </li>
              {properties.map((property) => (
                <li key={property.id}>
                  <div className="uk-panel">
                    <button
                      className="uk-button primary uk-margin-right"
                      style={{ width: "85%" }}
                      onClick={() => getPropetyId(property.id)}
                    >
                      {property.BodyCopName}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <a
              className="uk-position-center-left uk-position-small uk-hidden-hover"
              href="#"
              data-uk-slidenav-previous
              data-uk-slider-item="previous"
              style={{ background: "#000c37" }}
            ></a>
            <a
              className="uk-position-center-right uk-position-small uk-hidden-hover"
              href="#"
              data-uk-slidenav-next
              data-uk-slider-item="next"
              style={{ background: "#000c37" }}
            ></a>
          </div>
        </div>

        <table className="uk-table uk-table-divider uk-table-small">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Property</th>
              <th>Unit</th>
              <th>Financial Year</th>
              <th>Financial Month</th>
              <th>Verification</th>
              <th>POP confirmation</th>
              {/* <th>Total Due</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {result.map((inv) => (
              <tr key={inv.invoiceId}>
                <td>{inv.invoiceNumber}</td>
                <td>
                  {store.bodyCorperate.bodyCop.all
                    .filter((pro) => pro.asJson.id === inv.propertyId)
                    .map((pro) => {
                      return pro.asJson.BodyCopName;
                    })}
                </td>
                <td>
                  {store.bodyCorperate.unit.all
                    .filter((pro) => pro.asJson.id === inv.unitId)
                    .map((pro) => {
                      return "Unit " + pro.asJson.unitName;
                    })}
                </td>
                <td>
                  {store.bodyCorperate.financialYear.all
                    .filter((pro) => pro.asJson.id === inv.yearId)
                    .map((pro) => {
                      return pro.asJson.year;
                    })}
                </td>
                <td>
                  {store.bodyCorperate.financialMonth.all
                    .filter((pro) => pro.asJson.id === inv.monthId)
                    .map((pro) => {
                      if (pro.asJson.month === 1) return "JAN";
                      if (pro.asJson.month === 2) return "FEB";
                      if (pro.asJson.month === 3) return "MAR";
                      if (pro.asJson.month === 4) return "APR";
                      if (pro.asJson.month === 5) return "MAY";
                      if (pro.asJson.month === 6) return "JUN";
                      if (pro.asJson.month === 7) return "JUL";
                      if (pro.asJson.month === 8) return "AUG";
                      if (pro.asJson.month === 9) return "SEP";
                      if (pro.asJson.month === 10) return "OCT";
                      if (pro.asJson.month === 11) return "NOV";
                      if (pro.asJson.month === 12) return "DEC";
                    })}
                </td>
                <td>
                  {inv.verified === false && (
                    <span style={{ color: "orange" }}>
                      waiting for verification
                    </span>
                  )}
                  {inv.verified === true && (
                    <span style={{ color: "green" }}>verified</span>
                  )}
                </td>
                <td>
                  {inv.confirmed === false && (
                    <span style={{ color: "orange" }}>
                      waiting for confirmation
                    </span>
                  )}
                  {inv.confirmed === true && (
                    <span style={{ color: "green" }}>confirmed</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() =>
                      viewInvoiceDetails(
                        inv.invoiceId,
                        inv.propertyId,
                        inv.unitId,
                        inv.monthId,
                        inv.yearId
                      )
                    }
                    className="uk-button primary uk-margin-right"
                  >
                    More
                  </button>
                  <button
                    onClick={() =>
                      verifyInvoice(
                        inv.invoiceId,
                        inv.propertyId,
                        inv.unitId,
                        inv.monthId,
                        inv.yearId
                      )
                    }
                    style={{ background: "green" }}
                    className="uk-button primary"
                  >
                    Invoice
                  </button>
                </td>
                <td>
                  {inv.pop && (
                    <a target="blank" href={inv.pop}>
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
        {result.map((inv) => inv).length === 0 && <p>No invoices</p>}
      </div>
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
                  Invoice Number: {invoiceView?.invoiceNumber}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "end",
                    textTransform: "uppercase",
                  }}
                >
                  Date: {invoiceView?.dateIssued.toLocaleString()}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "end",
                    textTransform: "uppercase",
                  }}
                >
                  Due Date: {invoiceView?.dueDate}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "end",
                    textTransform: "uppercase",
                  }}
                >
                  Total Due: N$ {invoiceView?.totalDue.toFixed(2)}
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
              {invoiceView?.serviceId.map((det, index) => (
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
        </div>
      </Modal>
    </div>
  );
});
