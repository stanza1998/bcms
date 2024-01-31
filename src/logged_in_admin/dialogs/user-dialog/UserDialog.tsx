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

const UserDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser>({ ...defaultUser });
  const [passwordType, setPasswordType] = useState("password");
  const [selected, setSelected] = useState(false);
    
  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (store.user.selected){
        await api.auth.updateUser(user);
      } 
      else 
      user.devUser = false;
      user.password ="123456789";
      await api.auth.createUser(user);
      ui.snackbar.load({
        id: Date.now(),
        message: "Employee Created!",
        type: "success",
      });    } catch (error) {
      FailedAction(ui);
    }

    store.user.clearSelected();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.TEAM.USER_DIALOG);
  };

  const onDepartmentChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setUser({
      ...user,
      departmentId: e.target.value,
      departmentName: e.target.options[e.target.selectedIndex].text,
    });
  };

  const onRegionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setUser({
      ...user,
      regionId: e.target.value,
      region: e.target.options[e.target.selectedIndex].text,
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
      ></button>

      <h3 className="uk-modal-title">User</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-grid-small uk-child-width-1-1@m" data-uk-grid>
              <div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="department">
                    Department
                  </label>
                  <div className="uk-form-controls">
                    <select
                      id="department"
                      className="uk-select "
                      value={user.departmentId}
                      onChange={onDepartmentChange}
                      required
                    >
                      <option>Select...</option>
                      {store.department.all.map((department) => (
                        <option value={department.id} key={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="uk-width-1-2@m">
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="first-name">
                    First Name
                  </label>
                  <div className="uk-form-controls">
                    <input
                      id="first-name"
                      className="uk-input "
                      type="text"
                      placeholder="First name"
                      value={user.firstName}
                      onChange={(e) =>
                        setUser({ ...user, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="uk-width-1-2@m">
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="last-name">
                    Last Name
                  </label>
                  <div className="uk-form-controls">
                    <input
                      id="last-name"
                      className="uk-input "
                      type="text"
                      placeholder="Last name"
                      value={user.lastName}
                      onChange={(e) =>
                        setUser({ ...user, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
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
                      placeholder="Email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      disabled={selected}
                      required
                    />
                  </div>
                </div>
                
              </div>

              {/* <div>
                <div className="uk-margin uk-inline uk-width-1-1">
                  <label className="uk-form-label" htmlFor="password">
                    Password
                  </label>
                  <div className="uk-form-controls">
                    <button
                      type="button"
                      className="icon-button uk-form-icon uk-form-icon-flip"
                      onClick={togglePassword}
                    >
                      {passwordType === "password" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
                    <input
                      id="password"
                      className="uk-input "
                      type={passwordType}
                      placeholder="Password"
                      value={user.password}
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                      required
                      disabled={selected}
                    />
                    <span>Default: firstname@lastname</span>
                  </div>
                </div>
              </div> */}
              <div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="supervisor">
                    Supervisor (Deparmental Lead)
                  </label>
                  <div className="uk-form-controls">
                    <select
                      id="supervisor"
                      className="uk-select "
                      value={user.supervisor}
                      onChange={(e) =>
                        setUser({ ...user, supervisor: e.target.value })
                      }
                      required
                    >
                      <option>Select...</option>
                      {store.user.all.map((user) => (
                        <option value={user.uid} key={user.uid}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
              </div>
              <div>
                <div className="uk-margin">
                  <div className="uk-form-label">Role</div>
                  <div className="uk-form-controls">
                    <div className="uk-margin">
                      <select
                        className="uk-select "
                        value={user.role}
                        onChange={(e) =>
                          setUser({ ...user, role: e.target.value })
                        }
                        required
                      >
                        <option>Select...</option>
                        <option value={USER_ROLES.ADMIN}>Administrator</option>
                        <option value={USER_ROLES.HUMAN_RESOURCE}>
                          Human Resources
                        </option>
                        <option value={USER_ROLES.DIRECTOR}>Director</option>
                        <option value={USER_ROLES.MANAGING_DIRECTOR}>
                          Managing Director
                        </option>
                        <option value={USER_ROLES.GENERAL_MANAGER}>
                          General Manager
                        </option>
                        <option value={USER_ROLES.MANAGER}>Manager</option>
                        <option value={USER_ROLES.SUPERVISOR}>
                          Supervisor
                        </option>
                        <option value={USER_ROLES.EMPLOYEE}>Employee</option>
                        <option value={USER_ROLES.INTERN}>Intern</option>
                      </select>
                    </div>
                  </div>
                </div>
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

export default UserDialog;
