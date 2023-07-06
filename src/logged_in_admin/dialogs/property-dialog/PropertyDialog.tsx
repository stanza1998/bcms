import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../Dialogs";
import { IBodyCop, defaultBodyCop } from "../../../shared/models/bcms/BodyCorperate";

export const PropertyDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);


  const [body, setBodyCop] = useState<IBodyCop>({
    ...defaultBodyCop,
  });


  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Update API
    try {
      if (store.bodyCorperate.bodyCop.selected) {
        const deptment = await api.body.body.update(body);
        if (deptment) await store.bodyCorperate.bodyCop.load([deptment]);
        ui.snackbar.load({
          id: Date.now(),
          message: "Property updated!",
          type: "success",
        });
      } else {
        await api.body.body.create(body);
        ui.snackbar.load({
          id: Date.now(),
          message: "body created!",
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

    store.bodyCorperate.bodyCop.clearSelected();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.BODY.BODY_CORPORATE_DIALOG);
  };

  useEffect(() => {
    if (store.bodyCorperate.bodyCop.selected) setBodyCop(store.bodyCorperate.bodyCop.selected);
    else setBodyCop({ ...defaultBodyCop });

    return () => { };
  }, [store.bodyCorperate.bodyCop.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">body</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Property Name
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  type="text"
                  placeholder="body name"
                  value={body.BodyCopName}
                  onChange={(e) =>
                    setBodyCop({ ...body, BodyCopName: e.target.value })
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


