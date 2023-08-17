import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import { IUnit, defaultUnit } from "../../../../../shared/models/bcms/Units";
import Loading from "../../../../../shared/components/Loading";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import Modal from "../../../../../shared/components/Modal";
import { FinacialYearDialog } from "../../../../dialogs/financial-year-dialog/FinancialYearDialog";
import folder from "./assets/folder (3).png";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../shared/models/bcms/BodyCorperate";

export const UnitInfor = observer(() => {
  const { propertyId, id } = useParams();
  const { store, api, ui } = useAppContext();
  const navigate = useNavigate();
  const [loadingS, setLoadingS] = useState(true);

  const [property, setProperty] = useState<IBodyCop | undefined>({
    ...defaultBodyCop,
  });

  useEffect(() => {
    const getData = async () => {
      if (!propertyId) {
        window.alert("Cannot find ");
      } else {
        await api.body.body.getAll();
        const unit = store.bodyCorperate.bodyCop.getById(propertyId);
        setProperty(unit?.asJson);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [api.auth, api.body.body, propertyId, store.bodyCorperate.bodyCop]);

  const [info, setInfo] = useState<IUnit | undefined>({
    ...defaultUnit,
  });

  useEffect(() => {
    const getData = async () => {
      if (!id) {
        window.alert("Cannot find ");
      } else {
        await api.body.body.getAll();
        const unit = store.bodyCorperate.unit.getById(id);
        setInfo(unit?.asJson);
        await api.auth.loadAll();
      }
    };
    getData();
  }, [api.auth, api.body.body, api.body.unit, id, store.bodyCorperate.unit]);

  const back = () => {
    navigate(`/c/body/body-corperate/${info?.bodyCopId}`);
  };

  const [activeTab, setActiveTab] = useState("overview");

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  setTimeout(() => {
    setLoadingS(false);
  }, 1000);

  const backToUnit = () => {
    navigate(`/c/body/body-corperate/${propertyId}`);
  };
  const backToProperty = () => {
    navigate(`/c/body/body-corperate`);
  };

  return (
    <div className="uk-section leave-analytics-page sales-order">
      {loadingS ? (
        <Loading />
      ) : (
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
            </p>
            <div className="controls">
              <div className="uk-inline">
                <button
                  className="uk-button primary"
                  type="button"
                  onClick={back}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
          <div
            className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
            data-uk-grid
          >
            <div>
              <div className="uk-card uk-card-default uk-card-body">
                <p>OWNER NAME</p>
                <h3
                  className="uk-card-title"
                  style={{
                    fontWeight: "600",
                    color: "grey",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  {store.user.all
                    .filter((user) => user.uid === info?.ownerId)
                    .map((user) => {
                      return user.firstName + " " + user.lastName;
                    })}
                </h3>
              </div>
            </div>
            <div>
              <div className="uk-card uk-card-default uk-card-body">
                <p>EMAIL ADDRESS</p>
                <h3
                  className="uk-card-title"
                  style={{
                    fontWeight: "600",
                    color: "grey",
                    textTransform: "lowercase",
                    fontSize: "12px",
                  }}
                >
                  {store.user.all
                    .filter((user) => user.uid === info?.ownerId)
                    .map((user) => {
                      return user.email;
                    })}
                </h3>
              </div>
            </div>
            <div>
              <div className="uk-card uk-card-default uk-card-body">
                <p>CELLPHONE NUMBER</p>
                <h3
                  className="uk-card-title"
                  style={{
                    fontWeight: "600",
                    color: "grey",
                    textTransform: "lowercase",
                    fontSize: "12px",
                  }}
                >
                  {store.user.all
                    .filter((user) => user.uid === info?.ownerId)
                    .map((user) => {
                      return "+264" + user.cellphone;
                    })}
                </h3>
              </div>
            </div>
          </div>
          <div className="uk-margin">
            <div className="uk-margin">
              <button
                className={`uk-button primary uk-margin-right ${
                  activeTab === "overview" ? "active" : ""
                }`}
                onClick={() => handleTabClick("overview")}
              >
                Dashboard
              </button>
              <button
                className={`uk-button primary uk-margin-right ${
                  activeTab === "finance" ? "active" : ""
                }`}
                onClick={() => handleTabClick("finance")}
              >
                Financial Records
              </button>
              <button
                className={`uk-button primary uk-margin-right ${
                  activeTab === "maintenance" ? "active" : ""
                }`}
                onClick={() => handleTabClick("maintenance")}
              >
                Maintenance and Repairs
              </button>
              <button
                className={`uk-button primary uk-margin-right ${
                  activeTab === "communication" ? "active" : ""
                }`}
                onClick={() => handleTabClick("communication")}
              >
                Communication
              </button>
              <button
                className={`uk-button primary uk-margin-right ${
                  activeTab === "documents" ? "active" : ""
                }`}
                onClick={() => handleTabClick("documents")}
              >
                Documents
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === "overview" && (
                <div className="dashboard">
                  <Dashboard />
                </div>
              )}
              {activeTab === "finance" && (
                <div className="finance">
                  <FinacialRecords />
                </div>
              )}
              {activeTab === "maintenance" && (
                <div className="maintenance">
                  <Maintenance />
                </div>
              )}
              {activeTab === "communication" && (
                <div className="communication">
                  <Communication />
                </div>
              )}
              {activeTab === "documents" && (
                <div className="documents">
                  <Documents />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const Dashboard = () => {
  return (
    <div>
      <h3
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "600" }}
      >
        Dashboard
      </h3>

      <h5
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "500" }}
      >
        Financial Records
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
              Invoices
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
              Expenses
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
      <h5
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "500" }}
      >
        Maintenance and Records
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
              Scheduled Maintenance
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
              Repairs
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
              Ongoing Issues
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinacialRecords = observer(() => {
  const { store, api, ui } = useAppContext();
  const { propertyId, id } = useParams();
  const navigate = useNavigate();

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.FINANCIAL_YEAR);
  };

  useEffect(() => {
    const getData = async () => {
      await api.body.financialYear.getAll();
    };
    getData();
  }, [api.body.financialYear]);

  const viewYear = (yearId: string) => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}/${yearId}`);
  };

  return (
    <div className="sales-order">
      <h3
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "600" }}
      >
        Financial Records
      </h3>
      <button className="uk-button primary" onClick={onCreate}>
        New Year
      </button>

      <div
        className="uk-child-width-1-6@m uk-grid-small uk-grid-match"
        data-uk-grid
      >
        {store.bodyCorperate.financialYear.all
          .sort((a, b) => a.asJson.year - b.asJson.year)
          .map((year) => (
            <div key={year.asJson.id}>
              <div
                className="uk-card-body folders"
                onClick={() => viewYear(year.asJson.id)}
              >
                <img src={folder} alt="" />
                <p style={{ textAlign: "center", marginTop: "-0.5rem" }}>
                  {year.asJson.year}
                </p>
              </div>
            </div>
          ))}
      </div>

      <Modal modalId={DIALOG_NAMES.BODY.FINANCIAL_YEAR}>
        <FinacialYearDialog />
      </Modal>
    </div>
  );
});

const Maintenance = () => {
  return (
    <div>
      <h3
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "600" }}
      >
        Maintenance and Repairs
      </h3>
    </div>
  );
};
const Communication = () => {
  return (
    <div>
      <h3
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "600" }}
      >
        Communication
      </h3>
    </div>
  );
};
const Documents = () => {
  return (
    <div>
      <h3
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "600" }}
      >
        Documents
      </h3>
    </div>
  );
};
