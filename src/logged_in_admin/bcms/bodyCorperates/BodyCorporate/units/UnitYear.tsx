import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../../shared/components/Loading";
import { useAppContext } from "../../../../../shared/functions/Context";
import { IUnit, defaultUnit } from "../../../../../shared/models/bcms/Units";
import {
  IFinancialYear,
  defaultFinancialYear,
} from "../../../../../shared/models/yearModels/FinancialYear";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../shared/models/bcms/BodyCorperate";

export const UnitYear = observer(() => {
  const { api, store } = useAppContext();
  const { propertyId, id, yearId } = useParams();
  const navigate = useNavigate();
  const [laoderS, setLoaderS] = useState(true);
  const me = store.user.meJson;

  const back = () => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}`);
  };

  useEffect(() => {
    const getData = async () => {
      if (!me?.property) return;
      await api.body.financialYear.getAll(me.property);
      await api.unit.getAll(me.property);
      if (me.property && me.year)
        await api.body.financialMonth.getAll(me.property, me.year);
    };
    getData();
  }, [
    api.body.financialMonth,
    api.body.financialYear,
    api.unit,
    me?.property,
    me?.year,
  ]);

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
  }, [api.auth, api.body.body, api.unit, id, store.bodyCorperate.unit]);

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
  }, [api.auth, propertyId, store.bodyCorperate.bodyCop]);

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

  setTimeout(() => {
    setLoaderS(false);
  }, 1000);

  const backToYear = () => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}`);
  };
  const backToUnit = () => {
    navigate(`/c/body/body-corperate/${propertyId}`);
  };
  const backToProperty = () => {
    navigate(`/c/body/body-corperate`);
  };

  return (
    <div className="uk-section leave-analytics-page sales-order">
      {laoderS ? (
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
              / <span> Financial Records / </span>
              <span onClick={backToYear} style={{ cursor: "pointer" }}>
                {" "}
                {year?.year}{" "}
              </span>
            </p>
            <div className="controls">
              <div className="uk-inline">
                <button
                  onClick={back}
                  className="uk-button primary uk-margin-left"
                  type="button"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
          <div
            className="uk-child-width-1-6@m uk-grid-small uk-grid-match"
            data-uk-grid
          ></div>
        </div>
      )}
    </div>
  );
});
