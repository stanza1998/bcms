import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import { IUnit, defaultUnit } from "../../../../../../shared/models/bcms/Units";
import Loading from "../../../../../../shared/components/Loading";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../../shared/models/bcms/BodyCorperate";
import { Tab } from "../../../../../../Tab";
import { FinacialRecords } from "../unit-info-components/financial-records/FinancialRecords";
import Dashboard from "../../../../../dashboard/Dashboard";
import { Maintenance } from "../unit-info-components/maintenance/Maintenance";
import { Communication } from "../unit-info-components/communication/Communication";
import { Documents } from "../unit-info-components/documents/Documents";

export const UnitInfor = observer(() => {
  const { propertyId, id } = useParams();
  const { store, api } = useAppContext();
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
  }, [api.auth, api.body.body, api.unit, id, store.bodyCorperate.unit]);

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
            <div>
              <div
                style={{ padding: "10px" }}
                className="uk-margin  uk-card-default"
              >
                <Tab
                  label="Overview"
                  isActive={activeTab === "overview"}
                  onClick={() => handleTabClick("overview")}
                />
                <Tab
                  label="Financial Records"
                  isActive={activeTab === "finance"}
                  onClick={() => handleTabClick("finance")}
                />
                <Tab
                  label="Maintenance"
                  isActive={activeTab === "maintenance"}
                  onClick={() => handleTabClick("maintenance")}
                />
                <Tab
                  label="Communication"
                  isActive={activeTab === "communication"}
                  onClick={() => handleTabClick("communication")}
                />
                <Tab
                  label="Documents"
                  isActive={activeTab === "documents"}
                  onClick={() => handleTabClick("documents")}
                />
              </div>
              <div className="tab-content">
                {activeTab === "overview" && <div className="dashboard"></div>}
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
        </div>
      )}
    </div>
  );
});
