import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { ITransfer, defaultTransfer } from "../../../shared/models/Types/Transfer";
import DIALOG_NAMES from "../Dialogs";


export const CreditNoteDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const [transfer, setTransfer] = useState<ITransfer>({
    ...defaultTransfer,
  });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;

    // Update API
    try {
      if (store.bodyCorperate.transfer.selected) {
        const deptment = await api.body.transfer.update(transfer, me.property);
        await store.bodyCorperate.transfer.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "Account Created!",
          type: "success",
        });
      } else {
        await api.body.transfer.create(transfer, me.property);
        ui.snackbar.load({
          id: Date.now(),
          message: "Account created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update Account.",
        type: "danger",
      });
    }

    store.bodyCorperate.transfer.clearSelected();
    clear();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
  };

  const clear = () => {
    setTransfer({ ...defaultTransfer });
  };

  useEffect(() => {
    if (store.bodyCorperate.transfer.selected)
      setTransfer(store.bodyCorperate.transfer.selected);
    else setTransfer({ ...defaultTransfer });

    return () => {};
  }, [store.bodyCorperate.transfer.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={clear}
      ></button>

      <h3 className="uk-modal-title">Transfer</h3>
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
                  value={transfer.name}
                  onChange={(e) =>
                    setTransfer({
                      ...transfer,
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
                  value={transfer.description}
                  onChange={(e) =>
                    setTransfer({
                      ...transfer,
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
