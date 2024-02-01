import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { USER_ROLES } from "../../../shared/constants/USER_ROLES";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultUser, IUser } from "../../../shared/interfaces/IUser";
import {
  FailedAction,
  SuccessfulAction,
} from "../../../shared/models/Snackbar";
import DIALOG_NAMES from "../Dialogs";
import { IUnit, defaultUnit } from "../../../shared/models/bcms/Units";
import SingleSelect from "../../../shared/components/single-select/SlingleSelect";
import { useParams } from "react-router-dom";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../shared/models/bcms/BodyCorperate";
import makeAnimated from "react-select/animated";
import Select from "react-select";

const OwnerDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser>({ ...defaultUser });
  const [propertyId, setPropertyId] = useState<string>("");
  const [ownerId, setOwnerId] = useState<string>("");
  const animatedComponents = makeAnimated();
  const units = store.bodyCorperate.unit.all.map((inv) => {
    return inv.asJson;
  });
  const properties = store.bodyCorperate.bodyCop.all.map((property) => {
    return { label: property.asJson.BodyCopName, value: property.asJson.id };
  });
  const owners = store.user.all
    .filter((u) => u.asJson.role === "Owner")
    .map((u) => {
      return {
        label: u.asJson.firstName + " " + u.asJson.lastName,
        value: u.asJson.uid,
      };
    });
  const me = store.user.meJson;
  const [passwordType, setPasswordType] = useState("password");
  const [unit, _setUnit] = useState<IUnit>({
    ...defaultUnit,
  });
  const [property, _setProperty] = useState<IBodyCop>({
    ...defaultBodyCop,
  });
  const [selected, setSelected] = useState(false);

  const handlePropertySelect = (id: string) => {
    setPropertyId(id);
  };

  // const onSave = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const _user: IUser = {
  //     ...user,
  //     devUser: false,
  //   };
  //   setLoading(true);
  //   try {
  //     if (store.user.selected){
  //       await api.auth.updateUser(_user);
  //     }
  //     else {
  //       _user.role = "Owner";
  //       await api.auth.createUser(_user);
  //     }
  //     SuccessfulAction(ui);
  //   } catch (error) {
  //     FailedAction(ui);
  //   }
  //   store.user.clearSelected();
  //   setLoading(false);
  //   hideModalFromId(DIALOG_NAMES.OWNER.ADD_OWNER_DIALOG);
  // };
  const createDefaultCreds = () => {
    setUser({
      ...user,
      devUser: false,
      password: "123456789", // Set a temporary password if needed
      role: "Owner",
    });

    console.log("My Default Cred: " + user);
  };

  const setUnitOwnerId = (_ownerId: string) => {
    console.log("Lets see the owner Id: " + _ownerId);
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
    } catch (error) {
      FailedAction(ui);
    }

    setLoading(false);
  };

  const reset = () => {
    store.user.clearSelected();
    setUser({ ...defaultUser });
  };

  const onDepartmentChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setUser({
      ...user,
      departmentId: e.target.value,
      departmentName: e.target.options[e.target.selectedIndex].text,
    });
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
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
                    >
                      Assign Property
                    </label>
                    <div className="uk-margin uk-form-controls">
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
                        placeholder="Search users"
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
