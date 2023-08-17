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
import { Tab } from "../../../../Tab";
import {
  ICopiedInvoice,
  defaultCopiedInvoice,
} from "../../../../shared/models/invoices/CopyInvoices";

export const Invoices = observer(() => {
  const [activeTab, setActiveTab] = useState("master");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

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
          <div className="uk-margin">
            <Tab
              label="Invoices"
              isActive={activeTab === "master"}
              onClick={() => handleTabClick("master")}
            />
           
          </div>
          <div className="tab-content">
            {activeTab === "master" && <MasterInvoices />}
            {activeTab === "copied" && <CopiedInvoices />}
          </div>
        </div>
      </div>
    </div>
  );
});

const MasterInvoices = observer(() => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      await api.body.invoice.getAll();
      await api.body.copiedInvoice.getAll();
      await api.body.unit.getAll();
      await api.body.financialYear.getAll();
      await api.body.financialMonth.getAll();
      await api.auth.loadAll();
    };
    getData();
  }, [api.auth, api.body.body, api.body.copiedInvoice, api.body.financialMonth, api.body.financialYear, api.body.invoice, api.body.unit]);

  const properties = store.bodyCorperate.bodyCop.all.map((inv) => {
    return inv.asJson;
  });

  const invoices = store.bodyCorperate.invoice.all;
  const invoicesC = store.bodyCorperate.copiedInvoices.all;

  const combinedInvoices = [...invoices, ...invoicesC];

  const mappedInvoices = combinedInvoices.map((invoice) => {
    // Your mapping logic here
    // You can access properties of the 'invoice' object using 'invoice.propertyName'
    // For example: invoice.id, invoice.amount, etc.
    return invoice.asJson;
  });

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
    yearId: string
  ) => {
    navigate(
      `/c/body/body-corperate/${propertyId}/${id}/${yearId}/${invoiceId}/accounting-view`
    );
  };

  return (
    <div>
      <table className="uk-table uk-table-divider uk-table-small">
        <thead>
          <tr>
            <th>#</th>
            <th>Invoice Number</th>
            <th>Property</th>
            <th>Unit</th>
            <th>Financial Year</th>
            <th className="uk-text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {mappedInvoices.map((inv, index) => (
            <tr key={inv.invoiceId}>
              <td>{index+1}</td>
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

              <td className="uk-text-right">
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
                      inv.yearId
                    )
                  }
                  style={{ background: "green" }}
                  className="uk-button primary"
                >
                  Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {invoices.map((inv) => inv).length === 0 && <p>No invoices</p>}
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

const CopiedInvoices = observer(() => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      await api.body.copiedInvoice.getAll();
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
    api.body.copiedInvoice,
    api.body.unit,
  ]);

  const invoices = store.bodyCorperate.copiedInvoices.all;

  const [invoiceView, setInvoiceView] = useState<ICopiedInvoice | undefined>({
    ...defaultCopiedInvoice,
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
    const invoiceDetails =
      store.bodyCorperate.copiedInvoices.getById(invoiceId);
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
    yearId: string
  ) => {
    navigate(
      `/c/body/body-corperate/copied/${propertyId}/${id}/${yearId}/${invoiceId}`
    );
  };

  return (
    <div>
      <table className="uk-table uk-table-divider uk-table-small">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Property</th>
            <th>Unit</th>
            <th>Financial Year</th>
            <th className="uk-text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.asJson.invoiceId}>
              <td>{inv.asJson.invoiceNumber}</td>
              <td>
                {store.bodyCorperate.bodyCop.all
                  .filter((pro) => pro.asJson.id === inv.asJson.propertyId)
                  .map((pro) => {
                    return pro.asJson.BodyCopName;
                  })}
              </td>
              <td>
                {store.bodyCorperate.unit.all
                  .filter((pro) => pro.asJson.id === inv.asJson.unitId)
                  .map((pro) => {
                    return "Unit " + pro.asJson.unitName;
                  })}
              </td>
              <td>
                {store.bodyCorperate.financialYear.all
                  .filter((pro) => pro.asJson.id === inv.asJson.yearId)
                  .map((pro) => {
                    return pro.asJson.year;
                  })}
              </td>
              <td className="uk-text-right">
                <button
                  onClick={() =>
                    viewInvoiceDetails(
                      inv.asJson.invoiceId,
                      inv.asJson.propertyId,
                      inv.asJson.unitId,
                      inv.asJson.monthId,
                      inv.asJson.yearId
                    )
                  }
                  className="uk-button primary uk-margin-right"
                >
                  More
                </button>
                <button
                  onClick={() =>
                    verifyInvoice(
                      inv.asJson.invoiceId,
                      inv.asJson.propertyId,
                      inv.asJson.unitId,
                      inv.asJson.yearId
                    )
                  }
                  style={{ background: "green" }}
                  className="uk-button primary"
                >
                  Invoice
                </button>
              </td>
              <td>
                {inv.asJson.pop && (
                  <a target="blank" href={inv.asJson.pop}>
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
      {invoices.map((inv) => inv).length === 0 && <p>No invoices</p>}
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
