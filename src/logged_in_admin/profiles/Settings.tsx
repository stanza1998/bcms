import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../shared/functions/Context";
import { defaultUser, IUser } from "../../shared/interfaces/IUser";

const defaultPass = {
  oldPassword: "",
  newPassword: "",
};
const Settings = observer(() => {
  const { api, store } = useAppContext();
  const [user, setUser] = useState<IUser>({ ...defaultUser });
  const [security, setSecurity] = useState(defaultPass);

  const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await api.auth.updateUser(user);
    alert("Profile updated successfully!");
  };

  const updateSecurity = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      await api.auth.passwordResetWithOldPassword(
        user.email,
        security.oldPassword,
        security.newPassword
      );
      setSecurity(defaultPass);
    }
  };

  const sendPasswordResetEmail = () => {
    if (user.email) api.auth.passwordResetWithEmail(user.email);
  };

  const letter1 = user.firstName.charAt(0);
  const letter2 = user.lastName.charAt(0);

  useEffect(() => {
    if (!store.user.meJson) return;
    setUser(store.user.meJson);
    return () => { };
  }, [store.user.meJson]);

  return (
    <div className="uk-section uk-section-default">
      <div className="uk-container">
        <div className="profile-comp uk-card uk-card-default uk-card-small uk-margin-bottom">
          <div className="center uk-text-center">
            <div className="profile">
              <span>
                <h2 className="uk-margin-remove uk-text-bolder uk-text-uppercase">
                  {letter1}
                  {letter2}
                </h2>
              </span>
            </div>
          </div>
          <div className="uk-card-body">
            <form className="uk-form-stacked" onSubmit={updateProfile}>
              <div
                className="uk-margin uk-grid uk-child-width-1-2@m"
                data-uk-grid
              >
                <div>
                  <div>
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-fname"
                    >
                      First name
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input"
                        id="form-stacked-fname"
                        type="text"
                        placeholder="Name"
                        value={user.firstName}
                        onChange={(e) =>
                          setUser({ ...user, firstName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-lname"
                    >
                      Last name
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input"
                        id="form-stacked-lname"
                        type="text"
                        placeholder="Name"
                        value={user.lastName}
                        onChange={(e) =>
                          setUser({ ...user, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="uk-margin">
                  <div className="uk-form-label">Role</div>
                  <div className="uk-form-controls">
                    <select
                      className="uk-select"
                      defaultValue={user.role}
                    disabled
                    >
                  </select>
                </div>
              </div>
          </div>
          <div className="uk-margin">
            <button className="uk-button primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

        {/* <ToolBar title="Settings" /> */ }
  <ul data-uk-accordion>
    <li className="uk-card uk-card-default uk-card-small uk-card-body">
      <a className="uk-accordion-title" href="/#">
        Contact details
      </a>
      <div className="uk-accordion-content">
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="form-stacked-mail">
            Email address
          </label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="form-stacked-mail"
              type="email"
              placeholder="Email"
              defaultValue={user.email}
              disabled
            />
          </div>
        </div>
      </div>
    </li>
    <li className="uk-card uk-card-default uk-card-small uk-card-body">
      <a className="uk-accordion-title" href="/#">
        Security
      </a>
      <form className="uk-accordion-content" onSubmit={updateSecurity}>
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="form-stacked-opass">
            Old password
          </label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="form-stacked-opass"
              type="password"
              placeholder="Type your old password."
              value={security.oldPassword}
              onChange={(e) =>
                setSecurity({ ...security, oldPassword: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="form-stacked-npass">
            New Password
          </label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="form-stacked-npass"
              type="password"
              placeholder="Type your new password."
              value={security.newPassword}
              onChange={(e) =>
                setSecurity({ ...security, newPassword: e.target.value })
              }
            />
          </div>
        </div>
        <div className="uk-margin controls">
          <button
            className="uk-button primary uk-margin-small-bottom"
            type="submit"
          >
            Change password
          </button>
          <span
            className="uk-margin-left uk-margin-right uk-margin-small-bottom"
            style={{ fontSize: ".8rem", fontWeight: 600 }}
          >
            OR
          </span>
          <button
            className="uk-button uk-button-secondary uk-margin-small-bottom"
            type="button"
            onClick={sendPasswordResetEmail}
          >
            Send password reset email
          </button>
        </div>
      </form>
    </li>
  </ul>
      </div >
    </div >
  );
});

export default Settings;
