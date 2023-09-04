import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../../../shared/components/Loading";
import { useAppContext } from "../../../../../shared/functions/Context";
import { IUnit, defaultUnit } from "../../../../../shared/models/bcms/Units";
import {
  IFinancialYear,
  defaultFinancialYear,
} from "../../../../../shared/models/yearModels/FinancialYear";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import Modal from "../../../../../shared/components/Modal";
import { FinacialMonthDialog } from "../../../../dialogs/financial-month-dialog/FinancialMonthDialog";
import folder from "./assets/folder (3).png";
import {
  IFinancialMonth,
  defaultFinancialMonth,
} from "../../../../../shared/models/monthModels/FinancialMonth";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../shared/models/bcms/BodyCorperate";

export const UnitYear = observer(() => {
  const { api, store, ui } = useAppContext();
  const { propertyId, id, yearId } = useParams();
  const navigate = useNavigate();
  const [laoderS, setLoaderS] = useState(true);

  const back = () => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}`);
  };

  useEffect(() => {
    const getData = async () => {
      await api.body.financialYear.getAll();
      await api.unit.getAll();
      await api.body.financialMonth.getAll();
    };
    getData();
  }, [api.body.financialMonth, api.body.financialYear, api.unit]);

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

  const [financialMonth, setFinancialMonth] = useState<IFinancialMonth>({
    ...defaultFinancialMonth,
  });

  const [loading, setLoading] = useState(false);

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

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.FINANCIAL_MONTH);
  };

  const currentYear = year?.id;

  const viewMonth = (monthId: string) => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}/${yearId}/${monthId}`);
  };

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
