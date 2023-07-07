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
      await api.body.unit.getAll();
      await api.body.financialMonth.getAll();
    };
    getData();
  }, [api.body.financialMonth, api.body.financialYear, api.body.unit]);

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
  }, [api.auth, propertyId, store.bodyCorperate.bodyCop]);

  const [year, setYear] = useState<IFinancialYear | undefined>({
    ...defaultFinancialYear,
  });

  //dialog content

  const [financialMonth, setFinancialMonth] = useState<IFinancialMonth>({
    ...defaultFinancialMonth,
  });

  const [loading, setLoading] = useState(false);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Update API
    try {
      if (store.bodyCorperate.financialMonth.selected) {
        const deptment = await api.body.financialMonth.update(financialMonth);
        if (deptment) await store.bodyCorperate.financialMonth.load([deptment]);
        ui.snackbar.load({
          id: Date.now(),
          message: "financial Month updated!",
          type: "success",
        });
      } else {
        // Set a default year before creating the financial month
        const defaultYear = year?.id; // Set your desired default year here
        financialMonth.yearId = defaultYear;
        await api.body.financialMonth.create(financialMonth);
        ui.snackbar.load({
          id: Date.now(),
          message: "Financial Month created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update body.",
        type: "danger",
      });
    }

    store.bodyCorperate.financialMonth.clearSelected();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.BODY.FINANCIAL_MONTH);
  };

  useEffect(() => {
    if (store.bodyCorperate.financialMonth.selected)
      setFinancialMonth(store.bodyCorperate.financialMonth.selected);
    else setFinancialMonth({ ...defaultFinancialMonth });

    return () => {};
  }, [store.bodyCorperate.financialMonth.selected]);

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

  const savedMonths = store.bodyCorperate.financialMonth.all
    .filter((m) => m.asJson.yearId === currentYear)
    .map((mo) => {
      return mo.asJson.month;
    });

  const viewMonth = (monthId: string) => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}/${yearId}/${monthId}`);
  };

  setTimeout(() => {
    setLoaderS(false);
  }, 1000);

  return (
    <div className="uk-section leave-analytics-page sales-order">
      {laoderS ? (
        <Loading />
      ) : (
        <div className="uk-container uk-container-large">
          <div className="section-toolbar uk-margin">
            <h4
              className="section-heading uk-heading"
              style={{ textTransform: "uppercase" }}
            >
              {property?.BodyCopName} / Unit {info?.unitName}
              {" / Financial Records / "}
              {year?.year}
            </h4>
            <div className="controls">
              <div className="uk-inline">
                {savedMonths.length < 12 && (
                  <button
                    onClick={onCreate}
                    className="uk-button primary"
                    type="button"
                  >
                    New Month
                  </button>
                )}
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
          >
            {store.bodyCorperate.financialMonth.all
              .sort((a, b) => a.asJson.month - b.asJson.month)
              .filter((year) => year.asJson.yearId === currentYear)
              .map((year) => (
                <div key={year.asJson.id}>
                  <div
                    className="uk-card-body folders"
                    onClick={() => viewMonth(year.asJson.id)}
                  >
                    <img src={folder} alt="" />
                    <p style={{ textAlign: "center", marginTop: "-0.5rem" }}>
                      {year.asJson.month === 1 && (
                        <p style={{ textTransform: "uppercase" }}>JAN</p>
                      )}
                      {year.asJson.month === 2 && (
                        <p style={{ textTransform: "uppercase" }}>FEB</p>
                      )}
                      {year.asJson.month === 3 && (
                        <p style={{ textTransform: "uppercase" }}>MAR</p>
                      )}
                      {year.asJson.month === 4 && (
                        <p style={{ textTransform: "uppercase" }}>APR</p>
                      )}
                      {year.asJson.month === 5 && (
                        <p style={{ textTransform: "uppercase" }}>MAY</p>
                      )}
                      {year.asJson.month === 6 && (
                        <p style={{ textTransform: "uppercase" }}>JUN</p>
                      )}
                      {year.asJson.month === 7 && (
                        <p style={{ textTransform: "uppercase" }}>JUL</p>
                      )}
                      {year.asJson.month === 8 && (
                        <p style={{ textTransform: "uppercase" }}>AUG</p>
                      )}
                      {year.asJson.month === 9 && (
                        <p style={{ textTransform: "uppercase" }}>SEP</p>
                      )}
                      {year.asJson.month === 10 && (
                        <p style={{ textTransform: "uppercase" }}>OCT</p>
                      )}
                      {year.asJson.month === 11 && (
                        <p style={{ textTransform: "uppercase" }}>NOV</p>
                      )}
                      {year.asJson.month === 12 && (
                        <p style={{ textTransform: "uppercase" }}>DEC</p>
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <Modal modalId={DIALOG_NAMES.BODY.FINANCIAL_MONTH}>
            <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
              <button
                className="uk-modal-close-default"
                type="button"
                data-uk-close
              ></button>

              <h3 className="uk-modal-title">Financial Month</h3>
              <div className="dialog-content uk-position-relative">
                <div className="reponse-form">
                  <form className="uk-form-stacked" onSubmit={onSave}>
                    <div className="uk-margin">
                      <label
                        className="uk-form-label"
                        htmlFor="form-stacked-text"
                      >
                        Month
                      </label>
                      <div className="uk-form-controls">
                        <select
                          className="uk-input uk-form-small"
                          name=""
                          id=""
                          onChange={(e) =>
                            setFinancialMonth({
                              ...financialMonth,
                              month: Number(e.target.value),
                            })
                          }
                          required
                        >
                          <option value="">Select Month</option>
                          <option
                            value="01"
                            disabled={savedMonths.some((m) => m === 1)}
                          >
                            January
                          </option>
                          <option
                            value="02"
                            disabled={savedMonths.some((m) => m === 2)}
                          >
                            February
                          </option>
                          <option
                            value="03"
                            disabled={savedMonths.some((m) => m === 3)}
                          >
                            March
                          </option>
                          <option
                            disabled={savedMonths.some((m) => m === 4)}
                            value="04"
                          >
                            April
                          </option>
                          <option
                            disabled={savedMonths.some((m) => m === 5)}
                            value="05"
                          >
                            May
                          </option>
                          <option
                            disabled={savedMonths.some((m) => m === 6)}
                            value="06"
                          >
                            June
                          </option>
                          <option
                            disabled={savedMonths.some((m) => m === 7)}
                            value="07"
                          >
                            July
                          </option>
                          <option
                            disabled={savedMonths.some((m) => m === 8)}
                            value="08"
                          >
                            August
                          </option>
                          <option
                            disabled={savedMonths.some((m) => m === 9)}
                            value="09"
                          >
                            September
                          </option>
                          <option
                            disabled={savedMonths.some((m) => m === 10)}
                            value="10"
                          >
                            October
                          </option>
                          <option
                            disabled={savedMonths.some((m) => m === 11)}
                            value="11"
                          >
                            November
                          </option>
                          <option
                            disabled={savedMonths.some((m) => m === 12)}
                            value="12"
                          >
                            December
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="footer uk-margin">
                      <button className="uk-button secondary uk-modal-close">
                        Cancel
                      </button>
                      <button className="uk-button primary" type="submit">
                        Save
                        {loading && <div data-uk-spinner="ratio: .5"></div>}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
});
