import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import { IUnit, defaultUnit } from "../../../../../shared/models/bcms/Units";
import { useNavigate, useParams } from "react-router-dom";
import {
  IFinancialYear,
  defaultFinancialYear,
} from "../../../../../shared/models/yearModels/FinancialYear";
import {
  IFinancialMonth,
  defaultFinancialMonth,
} from "../../../../../shared/models/monthModels/FinancialMonth";
import Loading from "../../../../../shared/components/Loading";
import folder from "./assets/folder (3).png";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../shared/models/bcms/BodyCorperate";

export const UnitMonth = observer(() => {
  const { store, api, ui } = useAppContext();
  const { propertyId, id, yearId, monthId } = useParams();
  const navigate = useNavigate();

  const [info, setInfo] = useState<IUnit | undefined>({
    ...defaultUnit,
  });

  useEffect(() => {
    const getData = async () => {
      if (!id) {
        window.alert("Cannot find ");
      } else {
        const unit = store.bodyCorperate.unit.getById(id);
        setInfo(unit?.asJson);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [api.auth, api.body.body, api.body.unit, id, store.bodyCorperate.unit]);

  const [property, setProperty] = useState<IBodyCop | undefined>({
    ...defaultBodyCop,
  });

  useEffect(() => {
    const getData = async () => {
      if (!propertyId) {
        window.alert("Cannot find ");
      } else {
        const unit = store.bodyCorperate.bodyCop.getById(propertyId);
        setProperty(unit?.asJson);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [api.auth, store.bodyCorperate.bodyCop, propertyId]);

  const [year, setYear] = useState<IFinancialYear | undefined>({
    ...defaultFinancialYear,
  });

  useEffect(() => {
    const getData = async () => {
      if (!yearId) {
        window.alert("Cannot find ");
      } else {
        const unit = store.bodyCorperate.financialYear.getById(yearId);
        setYear(unit?.asJson);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [api.auth, store.bodyCorperate.financialYear, yearId]);

  const [month, setMonth] = useState<IFinancialMonth | undefined>({
    ...defaultFinancialMonth,
  });

  useEffect(() => {
    const getData = async () => {
      if (!monthId) {
        window.alert("Cannot find ");
      } else {
        const unit = store.bodyCorperate.financialMonth.getById(monthId);
        setMonth(unit?.asJson);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [api.auth, monthId, store.bodyCorperate.financialMonth]);

  const back = () => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}/${yearId}`);
  };

  const [laoderS, setLoaderS] = useState(true);

  setTimeout(() => {
    setLoaderS(false);
  }, 1000);

  //tabs
  const [activeTab, setActiveTab] = useState("unitFinance");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="uk-section leave-analytics-page">
      {laoderS ? (
        <Loading />
      ) : (
        <div className="uk-container uk-container-large">
          <div className="section-toolbar uk-margin">
            <h4
              className="section-heading uk-heading"
              style={{ textTransform: "uppercase" }}
            >
              {property?.BodyCopName} / Unit {info?.unitName} / Financial
              Records / {year?.year} / {month?.month === 1 && <>JAN</>}
              {month?.month === 2 && <>FEB</>}
              {month?.month === 3 && <>MAR</>}
              {month?.month === 4 && <>APR</>}
              {month?.month === 5 && <>MAY</>}
              {month?.month === 6 && <>JUN</>}
              {month?.month === 7 && <>JUL</>}
              {month?.month === 8 && <>AUG</>}
              {month?.month === 9 && <>SEP</>}
              {month?.month === 10 && <>OCT</>}
              {month?.month === 11 && <>NOV</>}
              {month?.month === 12 && <>DEC</>}
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
          <div>
            <button
              className={`uk-button primary uk-margin-right ${
                activeTab === "unitFinance" ? "active" : ""
              }`}
              onClick={() => handleTabClick("unitFinance")}
            >
              Unit Finance Dashboard
            </button>
            <button
              className={`uk-button primary uk-margin-right ${
                activeTab === "invoicing" ? "active" : ""
              }`}
              onClick={() => handleTabClick("invoicing")}
            >
              Invoicing
            </button>
            <button
              className={`uk-button primary uk-margin-right ${
                activeTab === "expenseTracking" ? "active" : ""
              }`}
              onClick={() => handleTabClick("expenseTracking")}
            >
              Expense Tracking
            </button>
            <button
              className={`uk-button primary uk-margin-right ${
                activeTab === "audit" ? "active" : ""
              }`}
              onClick={() => handleTabClick("audit")}
            >
              Audit
            </button>
          </div>

          <div className="uk-margin">
            {activeTab === "unitFinance" && (
              // Content for Unit Finance Dashboard tab
              <div>
                <UnitMiniDashboard />
              </div>
            )}

            {activeTab === "invoicing" && (
              // Content for Invoicing tab
              <div>
                <Invoicing />
              </div>
            )}

            {activeTab === "expenseTracking" && (
              // Content for Expense Tracking tab
              <div>
                <ExpenseTracking />
              </div>
            )}

            {activeTab === "audit" && (
              // Content for Audit tab
              <div>
                <Audit />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

const UnitMiniDashboard = () => {
  return (
    <div className="dashboard">
      <h3
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "600" }}
      >
        Unit Finance Dashboard
      </h3>

      <h5
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "500" }}
      >
        Invoicing
      </h5>
      <div
        className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
        data-uk-grid
      >
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Total Invoices
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Outstanding Invoices
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Paid Invoices
            </p>
          </div>
        </div>
      </div>
      <h5
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "500" }}
      >
        Expense Tracking
      </h5>
      <div
        className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
        data-uk-grid
      >
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Total Expenses
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Expense Categories
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Outstanding Payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Invoicing = () => {
  return (
    <div>
      <button
        className="uk-button primary uk-text-left uk-align-left"
        style={{ background: "green" }}
      >
        Create Invoice
      </button>
      <div>
        <table className="uk-table uk-table-small uk-table-divider">
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Location</th>
              <th>Invoice Number</th>
              <th>Date</th>
              <th>Reference</th>
              <th>Due Date</th>
              <th>Total Due</th>
              <th>Action</th>
            </tr>
          </thead>
          <table>
            <tr></tr>
          </table>
        </table>
      </div>
    </div>
  );
};
const ExpenseTracking = () => {
  return (
    <div>
      <h4>Expense Tracking</h4>
    </div>
  );
};
const Audit = () => {
  return (
    <div>
      <h4>Auditing</h4>
    </div>
  );
};
