import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../Dialogs";
import {
  IFinancialMonth,
  defaultFinancialMonth,
} from "../../../shared/models/monthModels/FinancialMonth";

export const FinacialMonthDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [financialMonth, setFinancialMonth] = useState<IFinancialMonth>({
    ...defaultFinancialMonth,
  });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Update API
    try {
      if (store.bodyCorperate.financialMonth.selected) {
        const deptment = await api.body.financialMonth.update(financialMonth);
        await store.bodyCorperate.financialMonth.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "financial Month updated!",
          type: "success",
        });
      } else {
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

  return (
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
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Month
              </label>
              <div className="uk-form-controls">
                <select
                  className="uk-input uk-form-small"
                  name=""
                  id=""
    
                  required
                >
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="January">January</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
                {/* <input
                  className="uk-input uk-form-small"
                  type="text"
                  placeholder="body name"
                  value={financialMonth.month}
             
                /> */}
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
  );
});
