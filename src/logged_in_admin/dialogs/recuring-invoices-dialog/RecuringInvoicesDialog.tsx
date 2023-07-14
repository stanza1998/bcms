import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../Dialogs";
import {
  IRecuringInvoice,
  defaultRecuringInvoice,
} from "../../../shared/models/invoices/RecuringInvoices";

export const RecuringInvoicesDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [recuringInovice, setInvoice] = useState<IRecuringInvoice>({
    ...defaultRecuringInvoice,
  });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Update API
    try {
      if (store.bodyCorperate.recuringInvoice.selected) {
        const deptment = await api.body.recuringInvoice.update(recuringInovice);
        if (deptment)
          await store.bodyCorperate.recuringInvoice.load([deptment]);
        ui.snackbar.load({
          id: Date.now(),
          message: "Recuring Invoice updated!",
          type: "success",
        });
      } else {
        await api.body.recuringInvoice.create(recuringInovice);
        ui.snackbar.load({
          id: Date.now(),
          message: "RecuringInvoice created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update Recuring Invoice.",
        type: "danger",
      });
    }

    store.bodyCorperate.recuringInvoice.clearSelected();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.BODY.RECURING_INVOICE);
  };

  const onClear = () => {
    store.bodyCorperate.recuringInvoice.clearSelected();
  };

  useEffect(() => {
    if (store.bodyCorperate.recuringInvoice.selected)
      setInvoice(store.bodyCorperate.recuringInvoice.selected);
    else setInvoice({ ...defaultRecuringInvoice });

    return () => {};
  }, [store.bodyCorperate.recuringInvoice.selected]);

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      await api.body.unit.getAll();
    };
    getData();
  }, [api.body.body, api.body.unit]);

  const [selectedBodyId, setSelectedBodyId] = useState("");

  const handleBodySelectChange = (event: any) => {
    const { value } = event.target;
    setSelectedBodyId(value);
  };

  return (
    <div
      className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
      style={{ width: "100%" }}
    >
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={onClear}
      ></button>

      <h3 className="uk-modal-title">Recuring Invoices</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <div
            className="uk-child-width-1-2@m uk-grid-small uk-grid-match"
            data-uk-grid
          >
            <div>
              <div className="uk-card uk-card-default uk-card-body" style={{borderRadius:"10px"}}>
                <input
                  type="text"
                  className="uk-input"
                  style={{ width: "50%" }}
                  placeholder="Description"
                />
                <input
                  type="number"
                  className="uk-input uk-margin-left"
                  style={{ width: "46%" }}
                  placeholder="Price"
                />
                <button className="uk-button primary uk-margin">
                  Add to Services
                </button>
                <table className="uk-table uk-table-small uk-table-divider">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th className="">Price</th>
                      <th className="uk-text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td className=""></td>
                      <td className="uk-text-right"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <form className="uk-form-stacked" onSubmit={onSave}>
                <div className="uk-card uk-card-default uk-card-body">
                  <div className="uk-margin">
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-text"
                    >
                      Property
                    </label>
                    <div className="uk-form-controls">
                      <select
                        name=""
                        id=""
                        className="uk-input"
                        onChange={handleBodySelectChange}
                      >
                        <option value="">Select Property</option>
                        {store.bodyCorperate.bodyCop.all.map((property) => (
                          <option
                            value={property.asJson.id}
                            key={property.asJson.id}
                          >
                            {property.asJson.BodyCopName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="uk-margin">
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-text"
                    >
                      Unit
                    </label>
                    <div className="uk-form-controls">
                      <select name="" id="" className="uk-input">
                        <option value="">Select Unit</option>
                        {store.bodyCorperate.unit.all
                          .filter(
                            (unit) => unit.asJson.bodyCopId === selectedBodyId
                          ) // Filter units by bodyId
                          .map((unit) => (
                            <option value={unit.asJson.id} key={unit.asJson.id}>
                              Unit {unit.asJson.unitName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="uk-margin">
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-text"
                    >
                      Total Amount Per given schedule
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input "
                        type="text"
                        placeholder="Total Amount"
                        value={recuringInovice.invoiceNumber}
                        onChange={(e) =>
                          setInvoice({
                            ...recuringInovice,
                            invoiceNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="footer uk-margin">
                  <button className="uk-button secondary uk-modal-close">
                    Cancel
                  </button>
                  <button className="uk-button primary" type="submit" disabled>
                    Save
                    {loading && <div data-uk-spinner="ratio: .5"></div>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
