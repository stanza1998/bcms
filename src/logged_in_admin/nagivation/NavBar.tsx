import React from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../../shared/functions/Context";

const NavBar = () => {
  const { api, store } = useAppContext();
  const navigate = useNavigate();
  const me = store.user.meJson;

  const letter1 = me?.firstName.charAt(0);
  const letter2 = me?.lastName.charAt(0);
  const property = store.bodyCorperate.bodyCop.all
    .filter((p) => p.asJson.active === true)
    .map((p) => {
      return p.asJson.BodyCopName;
    });
  const year = store.bodyCorperate.financialYear.all
    .filter((p) => p.asJson.active === true)
    .map((p) => {
      return p.asJson.year;
    });
  const month = store.bodyCorperate.financialMonth.all
    .filter((p) => p.asJson.active === true)
    .map((p) => {
      return p.asJson.month;
    });

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
                  fontSize: "14px",
                }}
              >
                {property.map((p) => {
                  return p + " ";
                })}
                {year.map((p) => {
                  return " " + p + " - ";
                })}
                {month.map((p) => {
                  return " " + p.slice(-2) + " ";
                })}
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
    </div>
  );
};

export default NavBar;
