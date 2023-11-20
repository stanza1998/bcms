import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import DIALOG_NAMES from "../dialogs/Dialogs";
import Modal from "../../shared/components/Modal";
import { IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";

const NavBar = observer(() => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();
  const me = store.user.meJson;
  const letter1 = me?.firstName.charAt(0);
  const letter2 = me?.lastName.charAt(0);

  const announcements = store.communication.announcements.all.map((a) => {
    return a.asJson;
  });

  const latestAnnouncement = announcements.filter((an) => {
    const expiryDate = new Date(an.expiryDate);
    const timestamp = expiryDate.getTime();
    const currentTimestamp = Date.now();
    return timestamp > currentTimestamp;
  });

  useEffect(() => {
    const getData = async () => {
      if ((me?.property, me?.year)) {
        await api.body.body.getAll();
        await api.body.propertyBankAccount.getAll(me.property);
        await api.body.financialYear.getAll(me?.property);
        await api.communication.announcement.getAll(me.property, me.year);
        await api.body.financialMonth.getAll(me.property, me.year);
      } else if (me?.property === "") {
        // FailedAction("User property not set");
      }
    };
    getData();
  }, [
    api.body.body,
    api.body.financialMonth,
    api.body.financialYear,
    api.communication.announcement,
    api.body.propertyBankAccount,
    me?.property,
    me?.year,
  ]);

  return (
    <div
      className="sticky"
      data-uk-sticky="sel-target: .uk-navbar; cls-active: uk-navbar-sticky"
    >
      <nav className="uk-navbar-container" data-uk-navbar>
        <div className="uk-navbar-left uk-hidden@s">
          <button
            className="uk-navbar-toggle"
            data-uk-navbar-toggle-icon
            data-uk-toggle="target: #navbar-drawer"
          ></button>
        </div>
        <div className="navbar-center uk-navbar-center">
          <ul className="uk-navbar-nav">{/* Add your navbar items here */}</ul>
        </div>
        <div className="navbar-right uk-navbar-right">
          <ul className="uk-navbar-nav">
            <li className="uk-inline" style={{ color: "#fff" }}>
              {/* Updated user profile design */}
              <div className="user-profile">
                <div
                  className="profile-circle"
                  style={{ backgroundColor: "#01aced" }}
                >
                  <span className="initials">
                    {letter1}
                    {letter2}
                  </span>
                </div>
                <div className="profile-info">
                  <p className="welcome-message">
                    <span className="user-name"></span>
                  </p>
                </div>
              </div>
              {/* Dropdown content */}
              <div
                className="profile-dropdown-container"
                data-uk-dropdown="mode: click; pos: bottom-justify"
              >
                <ul className="profile-dropdown uk-nav uk-dropdown-nav">
                  <li>
                    <button
                      className="uk-button primary"
                      onClick={() => navigate("/c/settings")}
                    >
                      <span
                        className="uk-margin-small-right"
                        data-uk-icon="settings"
                      ></span>
                      Settings
                    </button>
                  </li>
                  <li className="uk-nav-divider"></li>
                  <li>
                    <button
                      className="uk-button primary"
                      onClick={() => api.auth.signOutUser()}
                    >
                      <span
                        className="uk-margin-small-right"
                        data-uk-icon="sign-out"
                      ></span>
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <Modal modalId={DIALOG_NAMES.COMMUNICATION.VIEW_ANNOUNCEMENTS_DIALOG}>
        <div
          className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog announcements-container"
          style={{ width: "70%", height: "auto" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          <div className="uk-margin">
            <div className="announcements-header">
              You have {latestAnnouncement.length} new announcements
            </div>
            <div data-uk-accordion>
              {latestAnnouncement.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "solid grey 1px",
                    borderRadius: "4px",
                    padding: "10px",
                  }}
                >
                  <h3 className="uk-accordion-title">{item.title}</h3>
                  <div className="uk-accordion-content">
                    <div style={{ padding: "20px" }}>
                      <div className="announcement-container">
                        <div className="announcement-item" key={item.id}>
                          <p style={{ marginRight: "20px", marginTop: "20px" }}>
                            {item.message}
                          </p>
                          <p style={{ marginTop: "20px" }}>{item.expiryDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
});

export default NavBar;
