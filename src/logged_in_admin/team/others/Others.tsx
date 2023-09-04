import { observer } from "mobx-react-lite";
import Modal from "../../../shared/components/Modal";
import DIALOG_NAMES from "../../dialogs/Dialogs";
import { useAppContext } from "../../../shared/functions/Context";
import { IFinancialYear } from "../../../shared/models/yearModels/FinancialYear";
import { useEffect, useState } from "react";
import {
  FailedAction,
  SuccessfulAction,
} from "../../../shared/models/Snackbar";
import showModalFromId, {
  hideModalFromId,
} from "../../../shared/functions/ModalShow";
import { IFinancialMonth } from "../../../shared/models/monthModels/FinancialMonth";
import { IconButton } from "@mui/material";
import AdjustIcon from "@mui/icons-material/Adjust";
import SingleSelect from "../../../shared/components/single-select/SlingleSelect";

export const Others = observer(() => {
  const { store, api, ui } = useAppContext();
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const getData = async () => {
    await api.body.body.getAll();
    await api.body.financialYear.getAll();
    await api.body.financialMonth.getAll();
  };

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      await api.body.financialYear.getAll();
      await api.body.financialMonth.getAll();
    };
    getData();
  }, []);

  const properties = store.bodyCorperate.bodyCop.all.map((p) => p.asJson);

  const setActiveStatusProperty = async (id: string, active: boolean) => {
    setLoading(true);
    try {
      await api.body.body.setActiveStatus(id, true);
      getData();
      SuccessfulAction(ui);
    } catch (error) {
      console.log(error);
      FailedAction(error);
    }
    setLoading(false);
  };

  const years = store.bodyCorperate.financialYear.all.map((y) => y.asJson);

  const setActiveStatusYear = async (id: string, active: boolean) => {
    setLoading(true);
    try {
      await api.body.financialYear.setActiveStatus(id, true);
      getData();
      SuccessfulAction(ui);
    } catch (error) {
      console.log(error);
      FailedAction(error);
    }
    setLoading(false);
  };

  const months = store.bodyCorperate.financialMonth.all.map((m) => m.asJson);

  const setActiveStatusMonth = async (id: string, active: boolean) => {
    setLoading(true);
    try {
      await api.body.financialMonth.setActiveStatus(id, true);
      getData();
      SuccessfulAction(ui);
    } catch (error) {
      console.log(error);
      FailedAction(error);
    }
    setLoading(false);
  };

  const onCreateYear = () => {
    showModalFromId(DIALOG_NAMES.BODY.FINANCIAL_YEAR);
  };
  const onCreateMonth = () => {
    showModalFromId(DIALOG_NAMES.BODY.FINANCIAL_MONTH);
  };

  const onSave = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const Year: IFinancialYear = {
      id: "",
      year: year,
      active: false,
    };
    try {
      await api.body.financialYear.create(Year);
      SuccessfulAction(ui);
      hideModalFromId(DIALOG_NAMES.BODY.FINANCIAL_YEAR);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const onSaveMonth = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const Month: IFinancialMonth = {
      id: "",
      month: month,
      active: false,
    };
    try {
      await api.body.financialMonth.create(Month);
      SuccessfulAction(ui);
      hideModalFromId(DIALOG_NAMES.BODY.FINANCIAL_MONTH);
    } catch (error) {
      console.log(error);
      FailedAction(ui);
    }
    setLoading(false);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading"></h4>
          <div className="controls">
            <div className="uk-inline">
              <button
                className="uk-button primary uk-margin-right"
                type="button"
                onClick={onCreateYear}
              >
                Create Year
              </button>
              <button
                className="uk-button primary uk-margin-right"
                type="button"
                onClick={onCreateMonth}
              >
                Create Month
              </button>
            </div>
          </div>
        </div>

        {loading && <>loading...</>}
        <div className="Properties uk-margin">
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "600",
              color: "grey",
            }}
          >
            Properties
          </h6>
          <select
            className="uk-input"
            style={{ width: "50%" }}
            onChange={(e) => setSelectedProperty(e.target.value)}
          >
            <option value="">select</option>
            {properties.map((p) => (
              <option
                style={{
                  background: p.active === true ? "green" : "",
                  color: p.active === true ? "white" : "",
                }}
                value={p.id}
              >
                {p.BodyCopName}
              </option>
            ))}
          </select>
          <IconButton
            onClick={() => setActiveStatusProperty(selectedProperty, true)}
          >
            <AdjustIcon />
          </IconButton>
        </div>
        <div className="Years uk-margin">
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "600",
              color: "grey",
            }}
          >
            Years
          </h6>
          <select
            className="uk-input"
            style={{ width: "50%" }}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">select</option>
            {years
              .sort((a, b) => a.year - b.year)
              .map((p) => (
                <option
                  style={{
                    background: p.active === true ? "green" : "",
                    color: p.active === true ? "white" : "",
                  }}
                  value={p.id}
                >
                  {p.year}
                </option>
              ))}
          </select>
          <IconButton onClick={() => setActiveStatusYear(selectedYear, true)}>
            <AdjustIcon />
          </IconButton>
        </div>
        <div className="Months uk-margin">
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "600",
              color: "grey",
            }}
          >
            Month
          </h6>
          <select
            className="uk-input"
            style={{ width: "50%" }}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">select</option>
            {months
              .sort(
                (a, b) =>
                  new Date(a.month).getMonth() - new Date(b.month).getMonth()
              )
              .map((p) => (
                <option
                  style={{
                    background: p.active === true ? "green" : "",
                    color: p.active === true ? "white" : "",
                  }}
                  value={p.month}
                >
                  {p.month}
                </option>
              ))}
          </select>
          <IconButton onClick={() => setActiveStatusMonth(selectedMonth, true)}>
            <AdjustIcon />
          </IconButton>
        </div>
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
              <form onSubmit={onSaveMonth}>
                <div>
                  <label>Select a Month</label>
                  <input
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    type="month"
                    className="uk-input uk-form-small"
                  />
                </div>
                <button className="uk-button primary uk-margin" type="submit">
                  Save
                  {loading && <div data-uk-spinner="ratio: .5"></div>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.FINANCIAL_YEAR}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>

          <h3 className="uk-modal-title">Financial Year</h3>
          <div className="dialog-content uk-position-relative">
            <div className="reponse-form">
              <form onSubmit={onSave}>
                <div>
                  <label>Enter a Year</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    min="1900"
                    max="2099"
                    className="uk-input uk-form-small"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                  />
                </div>
                <button className="uk-button primary uk-margin" type="submit">
                  Save
                  {loading && <div data-uk-spinner="ratio: .5"></div>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
});
