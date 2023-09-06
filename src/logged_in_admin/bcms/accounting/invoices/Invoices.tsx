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
import InvoicesGrid from "./copied-invoices/invoices-grid";

export const Invoices = observer(() => {
  const [activeTab, setActiveTab] = useState("master");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Customer</h4>
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
            <Tab
              label="Customer Transaction Reports"
              isActive={activeTab === "ctr"}
              onClick={() => handleTabClick("ctr")}
            />
            <Tab
              label="Customer Statements"
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
            {activeTab === "master" && <CopiedInvoices />}
          </div>
        </div>
      </div>
    </div>
  );
});

const CopiedInvoices = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      if (me?.property && me.year)
        await api.body.copiedInvoice.getAll(me.property, me.year);
      if (me?.property) await api.body.financialYear.getAll(me.property);
      if (me?.property && me?.year)
        await api.body.financialMonth.getAll(me.property, me.year);
      await api.auth.loadAll();
    };
    getData();
  }, [
    api.auth,
    api.body.body,
    api.body.copiedInvoice,
    api.body.financialMonth,
    api.body.financialYear,
    api.unit,
    me?.property,
    me?.year,
  ]);

  const invoicesC = store.bodyCorperate.copiedInvoices.all.map((statements) => {
    return statements.asJson;
  });

  return (
    <div>
      <InvoicesGrid data={invoicesC} />
    </div>
  );
});
