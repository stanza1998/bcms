import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { useEffect } from "react";

export const OwnerRecuringInvoices = observer(() => {
  const { store, api, ui } = useAppContext();
  const me = store.user.meJson;
  const currentDate = new Date();

  useEffect(() => {
    const getData = async () => {
      await api.body.recuringInvoice.getAll();
      await api.body.unit.getAll();
    };
    getData();
  }, [api.body.recuringInvoice, api.body.unit]);

  const units = store.bodyCorperate.unit.all
    .filter((unit) => unit.asJson.ownerId === me?.uid)
    .map((unit) => {
      return unit.asJson;
    });

  const myInvoices = store.bodyCorperate.recuringInvoice.all
    .filter((inv) => units.some((unit) => unit.id === inv.asJson.unitId))
    .map((inv) => {
      return inv;
    });

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4
            className="section-heading uk-heading"
            style={{ textTransform: "uppercase" }}
          >
            My Recuring Invoices 
          </h4>
          <div className="controls">
            <div className="uk-inline">Date: {currentDate.toLocaleString()}</div>
          </div>
        </div>
        <div className="uk-overflow-auto">
          <table className="uk-table uk-table-divider uk-table-small uk-table-responsive">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Property</th>
                <th>Unit</th>
                <th>Total Payment</th>
                <th>Due Day of Payment</th>
                <th>POP </th>
                <th>Action </th>
              </tr>
            </thead>
            <tbody>
              {myInvoices.map((inv) => (
                <tr key={inv.asJson.invoiceId}>
                  <td>{inv.asJson.invoiceNumber}</td>
                  <td>{inv.asJson.propertyId}</td>
                  <td>{inv.asJson.unitId}</td>
                  <td>N$ {inv.asJson.totalPayment.toFixed(2)}</td>
                  <td>{inv.asJson.dayOfMonth}th</td>
                  <td>POP</td>
                  <td>
                    <button
                      className="uk-button primary"
                      style={{ background: "orange" }}
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});
