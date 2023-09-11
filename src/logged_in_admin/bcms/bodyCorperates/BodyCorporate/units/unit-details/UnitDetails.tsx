import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../../shared/models/bcms/BodyCorperate";
import { IUnit, defaultUnit } from "../../../../../../shared/models/bcms/Units";
import {
  IFinancialYear,
  defaultFinancialYear,
} from "../../../../../../shared/models/yearModels/FinancialYear";
import { Tab } from "../../../../../../Tab";
import { Invoicing } from "./invoicing/Invoicing";
import { ExpenseTracking } from "./expense-tracking/ExpenseTracking";

export const UnitDetails = observer(() => {
  const { propertyId, id, yearId } = useParams();
  const navigate = useNavigate();
  const { store, api } = useAppContext();

  const [property, setProperty] = useState<IBodyCop | undefined>({
    ...defaultBodyCop,
  });
  const [info, setInfo] = useState<IUnit | undefined>({
    ...defaultUnit,
  });
  const [year, setYear] = useState<IFinancialYear | undefined>({
    ...defaultFinancialYear,
  });

  useEffect(() => {
    const getData = async () => {
      if (!propertyId || !id || !yearId) {
        window.alert("Cannot find ");
      } else {
        const unit = store.bodyCorperate.bodyCop.getById(propertyId);
        setProperty(unit?.asJson);
        const info = store.bodyCorperate.unit.getById(id);
        setInfo(info?.asJson);
        const year = store.bodyCorperate.financialYear.getById(yearId);
        setYear(year?.asJson);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [
    api.auth,
    id,
    propertyId,
    store.bodyCorperate.bodyCop,
    store.bodyCorperate.financialYear,
    store.bodyCorperate.unit,
    yearId,
  ]);

  const backToYear = () => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}`);
  };
  const backToUnit = () => {
    navigate(`/c/body/body-corperate/${propertyId}`);
  };
  const backToProperty = () => {
    navigate(`/c/body/body-corperate`);
  };

  //
  const [activeTab, setActiveTab] = useState("Invoicing");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <p
            className="section-heading uk-heading"
            style={{ textTransform: "uppercase" }}
          >
            <span onClick={backToProperty} style={{ cursor: "pointer" }}>
              {" "}
              {property?.BodyCopName}{" "}
            </span>{" "}
            /{" "}
            <span onClick={backToUnit} style={{ cursor: "pointer" }}>
              {" "}
              Unit {info?.unitName}{" "}
            </span>{" "}
            / <span> Financial Records / </span>
            <span onClick={backToYear} style={{ cursor: "pointer" }}>
              {" "}
              {year?.year}{" "}
            </span>
          </p>
          <div className="controls">
            <div className="uk-inline">
              <button
                className="uk-button primary"
                type="button"
                onClick={backToYear}
              >
                back
              </button>
            </div>
          </div>
        </div>
        <div className="uk-margin">
          <div>
            <div
              style={{ padding: "10px" }}
              className="uk-margin  uk-card-default"
            >
              <Tab
                label="Invoicing Overview"
                isActive={activeTab === "Invoicing"}
                onClick={() => handleTabClick("Invoicing")}
              />
              <Tab
                label="Expense Tracking Overview"
                isActive={activeTab === "Expense"}
                onClick={() => handleTabClick("Expense")}
              />
            </div>
            <div className="tab-content">
              {activeTab === "Invoicing" && <Invoicing />}
              {activeTab === "Expense" && <ExpenseTracking />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
