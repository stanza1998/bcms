import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const OwnerInvoices = observer(() => {
  const { store, ui, api } = useAppContext();
  const currentDate = new Date();
  const navigate = useNavigate();

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
    invoiceId: string,
    propertyId: string,
    id: string,
    yearId: string,
    monthId: string
  ) => {
    // alert(propertyId);
    // alert(id);
    // alert(yearId);
    // alert(monthId);
    // alert(invoiceId);
    navigate(
      `/c/finance/invoices-view/${propertyId}/${id}/${yearId}/${monthId}/${invoiceId}`
    );
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">
            My Invoices. Current Date: {currentDate.toLocaleString()}
          </h4>
          <div className="controls">
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

            <div className="uk-inline">
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
          </div>
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
              {invoices.map((inv, index) => (
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
                    <span style={{ color: "red" }}>not uploaded</span>
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
                      <span style={{ color: "red" }}>
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
          {invoices.length === 0 && <p style={{ color: "red" }}>No invoices</p>}
        </div>
      </div>
    </div>
  );
});
