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

  const properties = store.bodyCorperate.bodyCop.all;
  const years = store.bodyCorperate.financialYear.all;
  const months = store.bodyCorperate.financialMonth.all.map((m) => {
    return m.asJson;
  });

  const announcements = store.communication.announcements.all.map((a) => {
    return a.asJson;
  });

  const latestAnnouncement = announcements.filter((an) => {
    const expiryDate = new Date(an.expiryDate);
    const timestamp = expiryDate.getTime();
    const currentTimestamp = Date.now();
    return timestamp > currentTimestamp;
  });

  const bank_accounts = store.bodyCorperate.propetyBankAccount.all.map((m) => {
    return m.asJson;
  });

  const onViewAnnouncements = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.VIEW_ANNOUNCEMENTS_DIALOG);
  };

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
        <div className="navbar-right uk-navbar-left">
          <ul className="uk-navbar-nav">
            <li className="uk-inline" style={{ color: "white" }}>
              <h6
                style={{
                  color: "white",
                  fontWeight: "500",
                  margin: "10px",
                  fontSize: "12px",
                }}
              >
                <span className="uk-margin-right">
                  {properties
                    .filter((p) => p.asJson.id === me?.property)
                    .map((p) => {
                      return p?.asJson.BodyCopName;
                    })}
                  {properties
                    .filter((p) => p.asJson.id === me?.property)
                    .map((p) => {
                      return p.asJson.BodyCopName;
                    }).length === 0 && <>Property NOT Selected</>}
                </span>
                {me?.role === "Owner" ? (
                  <></>
                ) : (
                  <span className="uk-margin">
                    {years
                      .filter((p) => p.asJson.id === me?.year)
                      .map((p) => {
                        return p.asJson.year + " ";
                      })}
                    {years
                      .filter((p) => p.asJson.id === me?.year)
                      .map((p) => {
                        return p.asJson.year + " ";
                      }).length === 0 && <>Year NOT Selected </>}
                  </span>
                )}

                {/* <span className="uk-margin-right">
                  {months
                    .filter((p) => p.month === me?.month)
                    .map((p) => {
                      return p.month.slice(-2);
                    })}
                  {months
                    .filter((p) => p.month === me?.month)
                    .map((p) => {
                      return p.month.slice(-2);
                    }).length === 0 && <>Month NOT Selected</>}
                </span> */}
              </h6>
            </li>
          </ul>
        </div>
        <div className="navbar-right uk-navbar-center">
          <ul className="uk-navbar-nav">
            <li className="uk-inline" style={{ color: "white" }}>
              <h6
                style={{
                  color: "white",
                  fontWeight: "500",
                  margin: "14px",
                  fontSize: "12px",
                }}
              >
                {me?.role !== "Owner" && (
                  <>
                    <span>
                      Bank Account:{" "}
                      {bank_accounts
                        .filter((p) => p.id === me?.bankAccountInUse)
                        .map((p) => {
                          return p.name === p.name
                            ? p.name
                            : "Bank NOT Selected";
                        })}
                    </span>
                  </>
                )}
                {me?.role === "Owner" && (
                  <>
                    <IconButton
                      onClick={onViewAnnouncements}
                      style={{ position: "relative" }}
                    >
                      <CircleNotificationsIcon style={{ color: "white" }} />
                      <span
                        style={{
                          color: "white",
                          fontSize: "14px",
                          position: "absolute",
                          top: "0",
                          right: "0",
                        }}
                      >
                        {latestAnnouncement.length}
                      </span>
                    </IconButton>
                  </>
                )}
              </h6>
            </li>
          </ul>
        </div>
        <div className="navbar-right uk-navbar-right">
          <ul className="uk-navbar-nav">
            <li className="uk-inline" style={{ color: "white" }}>
              Welcome,{" "}
              <span className="uk-text-bold">
                {me?.firstName} {me?.lastName}
              </span>
              <button className="user-profile">
                <div className="profile">
                  <span>
                    <h3 className="uk-margin-remove uk-text-bold uk-text-uppercase">
                      {letter1}
                      {letter2}
                    </h3>
                  </span>
                </div>
              </button>
              <div
                className="profile-dropdown-container"
                data-uk-dropdown="mode: click; pos: bottom-justify"
              >
                <ul className="profile-dropdown uk-nav uk-dropdown-nav">
                  <li>
                    <button onClick={() => navigate("/c/settings")}>
                      <span
                        className="uk-margin-small-right"
                        data-uk-icon="settings"
                      ></span>
                      Settings
                    </button>
                  </li>
                  <li className="uk-nav-divider"></li>
                  <li>
                    <button onClick={() => api.auth.signOutUser()}>
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
          style={{ width: "100%" }}
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
            {latestAnnouncement.map((item) => (
              <ul
                key={item.id}
                data-uk-accordion
                style={{
                  border: "solid grey 1px",
                  borderRadius: "4px",
                  padding: "10px",
                }}
              >
                <li>
                  {item.title}

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
                </li>
              </ul>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
});

export default NavBar;
