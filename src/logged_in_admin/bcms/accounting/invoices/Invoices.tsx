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
          </div>
        </div>
      </div>
    </div>
  );
});

const MasterInvoices = observer(() => {
  const { store, api } = useAppContext();

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      await api.body.copiedInvoice.getAll();
      await api.body.financialYear.getAll();
      await api.body.financialMonth.getAll();
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
