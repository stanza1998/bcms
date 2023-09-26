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
import { PropertyDialog } from "../../dialogs/property-dialog/PropertyDialog";

export const Others = observer(() => {
  const { store, api, ui } = useAppContext();
  const me = store.user.meJson;
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    if (!me?.property) return FailedAction("property not set.");
    await api.body.body.getAll();
    await api.body.financialYear.getAll(me.property);
    if (me.property && me.year)
      await api.body.financialMonth.getAll(me.property, me.year);
  };

  useEffect(() => {
    const getData = async () => {
      if (!me?.property) return FailedAction("property not set.");
      await api.body.body.getAll();
      await api.body.financialYear.getAll(me.property);
      if (me.property && me.year)
        await api.body.financialMonth.getAll(me.property, me.year);
    };
    getData();
  }, []);

  const years = store.bodyCorperate.financialYear.all
    .filter((y) => y.asJson.id === me?.year)
    .map((y) => y.asJson);
  const months = store.bodyCorperate.financialMonth.all.map((m) => m.asJson);

  const onCreateProperty = () => {
    showModalFromId(DIALOG_NAMES.BODY.BODY_CORPORATE_DIALOG);
  };

  const onCreateYear = () => {
    showModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
  };
  const onCreateMonth = () => {
    showModalFromId(DIALOG_NAMES.BODY.BODY_UNIT_DIALOG);
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
      if (me?.property) await api.body.financialYear.create(Year, me?.property);
      SuccessfulAction(ui);
      hideModalFromId(DIALOG_NAMES.BODY.BODY_UNIT_DIALOG);
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
      if (me?.property && me?.year)
        await api.body.financialMonth.create(Month, me?.property, me?.year);
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

        <div className="uk-card uk-card-default uk-card-body uk-width-1-1@m">
          <h5
            style={{
              color: "grey",
              textTransform: "uppercase",
              fontWeight: "600",
              fontSize: "21px",
            }}
            className="uk-modal-title"
          >
            Active Financial Year:{" "}
            <span style={{ color: "#01aced" }}>
              {years.map((y) => {
                return y.year;
              })}
            </span>
          </h5>
          <p></p>
        </div>
        <br />
        <br />
        <div
          className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
          data-uk-grid
        >
          {months.map((m) => (
            <div>
              <div className="uk-card uk-card-default uk-card-body">
                <h3
                  style={{
                    color: "grey",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    fontSize: "21px",
                  }}
                  className="uk-modal-title"
                >
                  {m.month}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal modalId={DIALOG_NAMES.BODY.BODY_CORPORATE_DIALOG}>
        <PropertyDialog />
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.BODY_UNIT_DIALOG}>
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
      <Modal modalId={DIALOG_NAMES.BODY.ALLOCATE_DIALOGS}>
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
