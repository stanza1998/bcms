import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../Dialogs";
import {
  ISupplier,
  defaultSupplier,
} from "../../../shared/models/Types/Suppliers";

export const SupplierDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [supplier, setSupplier] = useState<ISupplier>({
    ...defaultSupplier,
  });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Update API
    try {
      if (store.bodyCorperate.supplier.selected) {
        const deptment = await api.body.supplier.update(supplier);
       await store.bodyCorperate.supplier.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "Account Created!",
          type: "success",
        });
      } else {
        await api.body.supplier.create(supplier);
        ui.snackbar.load({
          id: Date.now(),
          message: "Account created!",
          type: "success",
        });
      }
    } catch (error) {
      console.log("🚀 ~ file: SupplierDialog.tsx:42 ~ onSave ~ error:", error)
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update Account.",
        type: "danger",
      });
    }

    store.bodyCorperate.supplier.clearSelected();
    clear();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
  };

  const clear = () => {
    setSupplier({ ...defaultSupplier });
  };

  useEffect(() => {
    if (store.bodyCorperate.supplier.selected)
      setSupplier(store.bodyCorperate.supplier.selected);
    else setSupplier({ ...defaultSupplier });

    return () => {};
  }, [store.bodyCorperate.supplier.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={clear}
      ></button>

      <h3 className="uk-modal-title">Supplier Accounts</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Name
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  type="text"
                  placeholder="Name"
                  value={supplier.name}
                  onChange={(e) =>
                    setSupplier({
                      ...supplier,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Description
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  type="text"
                  placeholder="Description"
                  value={supplier.description}
                  onChange={(e) =>
                    setSupplier({
                      ...supplier,
                      description: e.target.value,
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
