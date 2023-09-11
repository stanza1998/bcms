import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../Dialogs";
import {
  INormalAccount,
  defaultAccount,
} from "../../../shared/models/Types/Account";

export const AccountDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const [account, setAccount] = useState<INormalAccount>({
    ...defaultAccount,
  });

  const categories = store.bodyCorperate.accountCategory.all.map((c) => {
    return c.asJson;
  });

  useEffect(() => {
    const getData = async () => {
      if (me?.property) await api.body.accountCategory.getAll(me.property);
    };
    getData();
  }, []);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API
    try {
      if (store.bodyCorperate.account.selected) {
        const deptment = await api.body.account.update(account, me.property);
        await store.bodyCorperate.account.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "Account Created!",
          type: "success",
        });
      } else {
        await api.body.account.create(account, me.property);
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

    store.bodyCorperate.account.clearSelected();
    clear();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
  };

  const clear = () => {
    setAccount({ ...defaultAccount });
  };

  useEffect(() => {
    if (store.bodyCorperate.account.selected)
      setAccount(store.bodyCorperate.account.selected);
    else setAccount({ ...defaultAccount });

    return () => {};
  }, [store.bodyCorperate.account.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={clear}
      ></button>

      <h3 className="uk-modal-title">Normal Accounts</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Name
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input "
                  type="text"
                  placeholder="Name"
                  value={account.name}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Account Description
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input "
                  type="text"
                  placeholder="Description"
                  value={account.description}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      description: e.target.value,
                    })
                  }
                  // required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Category
              </label>
              <div className="uk-form-controls">
                <select
                  className="uk-input "
                  value={account.category}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      category: e.target.value,
                    })
                  }
                  // required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option value={c.id}>{c.name}</option>
                  ))}
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
  );
});
