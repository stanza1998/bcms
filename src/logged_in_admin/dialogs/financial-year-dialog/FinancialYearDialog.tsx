import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../Dialogs";
import {
  IFinancialYear,
  defaultFinancialYear,
} from "../../../shared/models/yearModels/FinancialYear";

export const FinacialYearDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;

  const [financialYear, setFinancialYear] = useState<IFinancialYear>({
    ...defaultFinancialYear,
  });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API
    try {
      if (store.bodyCorperate.financialYear.selected) {
        const deptment = await api.body.financialYear.update(
          financialYear,
          me.property
        );
        await store.bodyCorperate.financialYear.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "financial Year updated!",
          type: "success",
        });
      } else {
        await api.body.financialYear.create(financialYear, me.property);
        ui.snackbar.load({
          id: Date.now(),
          message: "Financial Year created!",
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

    store.bodyCorperate.financialYear.clearSelected();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.BODY.FINANCIAL_YEAR);
  };

  useEffect(() => {
    if (store.bodyCorperate.financialYear.selected)
      setFinancialYear(store.bodyCorperate.financialYear.selected);
    else setFinancialYear({ ...defaultFinancialYear });

    return () => {};
  }, [store.bodyCorperate.financialYear.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Financial Year</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Year
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  type="text"
                  placeholder="body name"
                  value={financialYear.year}
                  onChange={(e) =>
                    setFinancialYear({
                      ...financialYear,
                      year: Number(e.target.value),
                    })
                  }
                  required
                />
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
