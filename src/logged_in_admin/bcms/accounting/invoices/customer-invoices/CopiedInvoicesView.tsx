import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../shared/models/bcms/BodyCorperate";
import { IUnit, defaultUnit } from "../../../../../shared/models/bcms/Units";
import Loading from "../../../../../shared/components/Loading";
import React from "react";
import {
  ICopiedInvoice,
  defaultCopiedInvoice,
} from "../../../../../shared/models/invoices/CopyInvoices";
import { nadFormatter } from "../../../../shared/NADFormatter";

export const CopiedInvoices = observer(() => {
  const { store, api } = useAppContext();
  const { propertyId, id, yearId, monthId, invoiceId } = useParams();
  const navigate = useNavigate();
  const me = store.user.meJson;
  const [loaderS, setLoaderS] = useState(true);
  const [invoice, setInvoice] = useState<ICopiedInvoice | undefined>({
    ...defaultCopiedInvoice,
  });
  const [viewBody, setBody] = useState<IBodyCop | undefined>({
    ...defaultBodyCop,
  });
  const [unit, setUnit] = useState<IUnit | undefined>({
    ...defaultUnit,
  });

  const back = () => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}/${yearId}/`);
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me.year)
        await api.body.copiedInvoice.getAll(me.property, me.year);
    };
    getData();
  }, [api.body.copiedInvoice, me?.property, me?.year]);

  useEffect(() => {
    const data = async () => {
      if (invoiceId) {
        const invoice = store.bodyCorperate.copiedInvoices.getById(invoiceId);
        setInvoice(invoice?.asJson);
      }
    };
    data();
  }, [invoiceId, store.bodyCorperate.copiedInvoices]);

  useEffect(() => {
    const data = async () => {
      if (propertyId || id || yearId || monthId) {
        await api.body.body.getAll();
        const property = store.bodyCorperate.bodyCop.getById(propertyId || "");
        setBody(property?.asJson);
        const unit = store.bodyCorperate.unit.getById(id || "");
        setUnit(unit?.asJson);
        await api.auth.loadAll();
      }
    };
    data();
  }, [
    api.auth,
    api.body.body,
    api.unit,
    id,
    monthId,
    propertyId,
    store.bodyCorperate.bodyCop,
    store.bodyCorperate.financialMonth,
    store.bodyCorperate.financialYear,
    store.bodyCorperate.unit,
    yearId,
  ]);

  setTimeout(() => {
    setLoaderS(false);
  }, 1000);

  return (
    <div className="uk-section leave-analytics-page">
      {loaderS ? (
        <Loading />
      ) : (
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
              {invoice?.invoiceNumber}
            </h4>
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
          <div className="uk-section">
            <div className="uk-container uk-container-meduim">
              <div
                className="uk-child-width-1-2@m uk-grid-small uk-grid-match"
                data-uk-grid
              >
                <div>
                  <div className="uk-card-body">
                    <p
                      style={{ textTransform: "capitalize", fontWeight: "800" }}
                    >
                      {viewBody?.BodyCopName} <br />
                      {viewBody?.location} <br />
                      Unit {unit?.unitName} <br />
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
                    <div className="uk-text-right">
                      <img
                        style={{ width: "60%", height: "60%" }}
                        src={process.env.PUBLIC_URL + "/icon1.png"}
                        alt="Phlo"
                      />
                    </div>
                    <p
                      className="uk-text-right"
                      style={{ textTransform: "capitalize", fontWeight: "800" }}
                    >
                      {" "}
                      Number: {invoice?.invoiceNumber} <br />
                      Reference: {invoice?.references} <br />
                      Date: {invoice?.dateIssued} <br />
                      Due Date: {invoice?.dueDate} <br />
                      {nadFormatter.format(invoice?.totalDue || 0)}
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
                  {invoice?.serviceId.map((details, index) => (
                    <tr key={index}>
                      <td style={{ textTransform: "uppercase" }}>
                        {details.description}
                      </td>
                      <td className="uk-text-center">
                        {nadFormatter.format(details.price)}
                      </td>
                      <td className="uk-text-right">
                        {nadFormatter.format(details.price)}
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
                {viewBody?.bankName} <br />
                Account Name : {viewBody?.accountName} <br />
                Account Number : {viewBody?.accountNumber} <br />
                Branch : {viewBody?.branchName} <br />
                Branch Code : {viewBody?.branchCode} <br />
                Account Style : {viewBody?.accountStyle} <br />
                SWIFT : {viewBody?.swift}
              </div>
            </div>
            <div className="controls">
              <div className="uk-inline">
                <div className="uk-text-right">
                  Total Discount: {nadFormatter.format(0)} <br />
                  Total Exclusive:
                  {nadFormatter.format(invoice?.priceBeforeTax || 0)} <br />
                  Total VAT: {nadFormatter.format(invoice?.vatPrice || 0)}
                  <br />
                  <hr />
                  Sub Total: {nadFormatter.format(invoice?.totalDue || 0)}
                  <hr />
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      )}
    </div>
  );
});
