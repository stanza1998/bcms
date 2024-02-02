import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultUser, IUser } from "../../../shared/interfaces/IUser";
import { FailedAction } from "../../../shared/models/Snackbar";
import DIALOG_NAMES from "../Dialogs";
import makeAnimated from "react-select/animated";
import Select from "react-select";

const OwnerDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser>({ ...defaultUser });
  const animatedComponents = makeAnimated();

  const properties = store.bodyCorperate.bodyCop.all.map((property) => {
    return { label: property.asJson.BodyCopName, value: property.asJson.id };
  });

  const me = store.user.meJson;

  const [selected, setSelected] = useState(false);

  const createDefaultCreds = () => {
    setUser({
      ...user,
      devUser: false,
      password: "123456789", // Set a temporary password if needed
      role: "Owner",
    });

    console.log("My Default Cred: " + user);
  };

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (store.user.selected) {
        // Update existing user
        await api.auth.updateUser(user);
        ui.snackbar.load({
          id: Date.now(),
          message: "Owner Updated!",
          type: "success",
        });
      } else {
        // Create new user
        user.devUser = false;
        user.password = "123456789";
        user.role = "Owner";
        await api.auth.createUser(user);
        ui.snackbar.load({
          id: Date.now(),
          message: "Owner Created!",
          type: "success",
        });
      }
      store.user.clearSelected();
      hideModalFromId(DIALOG_NAMES.OWNER.ADD_OWNER_DIALOG);
      hideModalFromId(DIALOG_NAMES.OWNER.UPDATE_OWNER_DIALOG);
    } catch (error) {
      FailedAction(ui);
    }

    setLoading(false);
  };

  const reset = () => {
    store.user.clearSelected();
    setUser({ ...defaultUser });
  };

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      if (me?.property) {
        await api.unit.getAll(me?.property);
      }
      await api.body.body.getAll();
      await api.auth.loadAll();
    };
    getData();
  }, [api.auth, api.body.body, api.unit, me?.property]);

  useEffect(() => {
    if (store.user.selected) {
      setUser(store.user.selected);
      setSelected(true);
    } else {
      setUser({ ...defaultUser });
      setSelected(false);
    }
  }, [store.user.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={reset}
      ></button>

      <h3 className="uk-modal-title">User</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-grid-small uk-child-width-1-1@m" data-uk-grid>
              <div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="user-email">
                    Email
                  </label>
                  <div className="uk-form-controls">
                    <input
                      id="user-email"
                      className="uk-input "
                      type="email"
                      placeholder="example@example.com"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      disabled={selected}
                      required
                    />
                  </div>
                  <div className="uk-width-1-1@m">
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-text"
                      style={{marginTop:"16px"}}
                    >
                      Assign Property
                    </label>
                    <div className="uk-form-controls">
                      <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        onChange={(value: any) =>
                          setUser({
                            ...user,
                            accessProperties: value.map((t: any) => t.value),
                          })
                        }
                        isMulti
                        placeholder="Search properties"
                        options={properties}
                        value={properties.filter((property) =>
                          user.accessProperties?.includes(property.value)
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
            <div className="footer uk-margin">
              <button className="uk-button secondary uk-modal-close">
                Cancel
              </button>
              <button
                className="uk-button primary"
                type="submit"
                onClick={createDefaultCreds}
              >
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

export default OwnerDialog;
