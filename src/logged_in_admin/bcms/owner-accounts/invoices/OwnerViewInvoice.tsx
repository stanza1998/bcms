import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  IInvoice,
  defaultInvoice,
} from "../../../../shared/models/invoices/Invoices";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../shared/models/bcms/BodyCorperate";
import { IUnit, defaultUnit } from "../../../../shared/models/bcms/Units";
import {
  IFinancialMonth,
  defaultFinancialMonth,
} from "../../../../shared/models/monthModels/FinancialMonth";
import {
  IFinancialYear,
  defaultFinancialYear,
} from "../../../../shared/models/yearModels/FinancialYear";
import Loading from "../../../../shared/components/Loading";

export const OwnerViewInvoice = observer(() => {
  const { store, api } = useAppContext();
  const { propertyId, id, yearId, monthId, invoiceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      await api.body.invoice.getAll();
    };
    getData();
  }, [api.body.invoice]);

  const [invoice, setInvoice] = useState<IInvoice | undefined>({
    ...defaultInvoice,
  });

  useEffect(() => {
    const data = async () => {
      if (invoiceId) {
        const invoice = store.bodyCorperate.invoice.getById(invoiceId);
        setInvoice(invoice?.asJson);
      }
    };
    data();
  }, [invoiceId, store.bodyCorperate.invoice]);

  const back = () => {
    navigate("/c/finance/invoices-view");
  };

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
    const data = async () => {
      if (propertyId || id || yearId || monthId) {
        await api.body.body.getAll();
        await api.body.financialMonth.getAll();
        await api.body.financialYear.getAll();
        await api.body.invoice.getAll();
        await api.body.unit.getAll();
        const property = store.bodyCorperate.bodyCop.getById(propertyId || "");
        setBody(property?.asJson);
        const unit = store.bodyCorperate.unit.getById(id || "");
        setUnit(unit?.asJson);
        const month = store.bodyCorperate.financialMonth.getById(yearId || "");
        setMonth(month?.asJson);
        const year = store.bodyCorperate.financialYear.getById(monthId || "");
        setYear(year?.asJson);
        await api.auth.loadAll();
      }
    };
    data();
  }, [
    api.auth,
    api.body.body,
    api.body.financialMonth,
    api.body.financialYear,
    api.body.invoice,
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

  //laader
  const [loaderS, setLoaderS] = useState(true);

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
                      Date: {invoice?.dateIssued} <br />
                      Due Date: {invoice?.dueDate} <br />
                      Total Due: N$ {invoice?.totalDue.toFixed(2)}
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
                  Total Discount: N$0.00 <br />
                  Total Exclusive: N${invoice?.totalDue.toFixed(2)} <br />
                  Total VAT: N$0.00
                  <br />
                  <hr />
                  Sub Total: N${invoice?.totalDue.toFixed(2)}
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
