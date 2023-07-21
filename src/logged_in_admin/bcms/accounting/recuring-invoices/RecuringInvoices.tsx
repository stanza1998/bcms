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

export const RecurringInvoices = observer(() => {
  const { store, api, ui } = useAppContext();

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
            {invoices.map((item) => (
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
                  <button className="uk-button primary">View POP's</button>
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
    </div>
  );
});
