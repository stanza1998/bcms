import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { NEDBANKCreate } from "./NEDBANK";

export const CreateSupplierInvoice = observer(() => {
  const navigate = useNavigate();
  const back = () => {
    navigate("/c/accounting/supplier-invoices");
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">
            Create Supplier Invoice
          </h4>
          <div className="controls">
            <div className="uk-inline">
              <button className="uk-button primary" onClick={back}>
                back
              </button>
            </div>
          </div>
        </div>
        <div className="uk-margin">
          <NEDBANKCreate />
        </div>
      </div>
    </div>
  );
});
