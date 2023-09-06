import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import SupplierInvoicesGrid from "./SupplierGrid";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import { Tab } from "../../../../../Tab";

export const SuppliersView = observer(() => {
  const [activeTab, setActiveTab] = useState("Invoices");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };
  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Suppliers</h4>
          <div className="controls">
            <div className="uk-inline"></div>
          </div>
        </div>
        <div>
          <div className="uk-margin">
            <Tab
              label="Invoices"
              isActive={activeTab === "Invoices"}
              onClick={() => handleTabClick("Invoices")}
            />
            <Tab
              label="Supplier Transaction Reports"
              isActive={activeTab === "ctr"}
              onClick={() => handleTabClick("ctr")}
            />
            <Tab
              label="Supplier Statements"
              isActive={activeTab === "st"}
              onClick={() => handleTabClick("st")}
            />
            <Tab
              label="Aging Analysis"
              isActive={activeTab === "aa"}
              onClick={() => handleTabClick("aa")}
            />
          </div>
          <div className="tab-content">
            {activeTab === "Invoices" && <SupplierInvoices />}
          </div>
        </div>
      </div>
    </div>
  );
});

const SupplierInvoices = observer(() => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();
  const me = store.user.meJson;

  useEffect(() => {
    const getData = async () => {
      if ((me?.property, me?.year))
        await api.body.supplierInvoice.getAll(me.property, me.year);
    };
    getData();
  }, [api.body.supplierInvoice, me?.property, me?.year]);

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
