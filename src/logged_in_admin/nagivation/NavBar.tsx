import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../../shared/functions/Context";
import DIALOG_NAMES from "../dialogs/Dialogs";
import Modal from "../../shared/components/Modal";
import { observer } from "mobx-react-lite";
import { Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import showModalFromId from "../../shared/functions/ModalShow";

const NavBar = observer(() => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();
  const me = store.user.meJson;
  const letter1 = me?.firstName.charAt(0);
  const letter2 = me?.lastName.charAt(0);
  const currentDate = new Date();

  const announcements = store.communication.announcements.all.map((a) => {
    return a.asJson;
  });



  const active = announcements.filter(
    (a) => new Date(a.expiryDate) >= new Date(currentDate)
  ).length;

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

  const onShowNotices = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.VIEW_ANNOUNCEMENTS_DIALOG);
  };

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
                  <span
                    className="initials"
                    style={{ textTransform: "uppercase" }}
                  >
                    {letter1}
                    {letter2}
                  </span>
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

    </div>
  );
});

export default NavBar;
