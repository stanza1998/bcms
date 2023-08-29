import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import SupplierInvoicesGrid from "./SupplierGrid";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useEffect } from "react";

export const SupplierInvoices = observer(() => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      await api.body.supplierInvoice.getAll();
    };
    getData();
  }, [api.body.supplierInvoice]);

  const create = () => {
    navigate("/c/accounting/supplier-invoices/create");
  };

  const invoices = store.bodyCorperate.supplierInvoice.all.map((inv) => {
    return inv.asJson;
  });

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Supplier Invoices</h4>
          <div className="controls">
            <div className="uk-inline">
              <button
                className="uk-button primary"
                type="button"
                onClick={create}
              >
                Create Supplier Invoice
              </button>
            </div>
          </div>
        </div>
        <SupplierInvoicesGrid data={invoices} />
      </div>
    </div>
  );
});
