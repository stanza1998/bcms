import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../../shared/functions/Context";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../shared/database/FirebaseConfig";
import showModalFromId, {
  hideModalFromId,
} from "../../shared/functions/ModalShow";
import DIALOG_NAMES from "../dialogs/Dialogs";
import Modal from "../../shared/components/Modal";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import { observer } from "mobx-react-lite";
import { FailedAction, SuccessfulAction } from "../../shared/models/Snackbar";
import { IPropertyBankAccount } from "../../shared/models/property-bank-account/PropertyBankAccount";

const NavBar = observer(() => {
  const { store, api, ui } = useAppContext();
  const navigate = useNavigate();
  const me = store.user.meJson;
  const [propertyId, setPropertyId] = useState<string>("");
  const [yearId, setYearId] = useState<string>("");
  const [monthId, setMonthId] = useState<string>("");
  const [accountId, setAccount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const letter1 = me?.firstName.charAt(0);
  const letter2 = me?.lastName.charAt(0);

  const updateDocument = async (fieldName: string, fieldValue: string) => {
    setLoading(true);
    if (me?.uid) {
      const docRef = doc(db, "Users", me.uid);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        await updateDoc(docRef, { [fieldName]: fieldValue });
        SuccessfulAction(ui);
        navigate("/c");
        window.location.reload();
      } else {
        FailedAction(ui);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.body.body.getAll();
        await api.body.propertyBankAccount.getAll(me.property);
        await api.body.financialYear.getAll(me?.property);
        if ((me?.property, me?.year))
          await api.body.financialMonth.getAll(me.property, me.year);
      } else {
        FailedAction("User property not set");
      }
    };
    getData();
  }, [
    api.body.body,
    api.body.financialMonth,
    api.body.financialYear,
    api.body.propertyBankAccount,
    me?.property,
    me?.year,
  ]);

  const properties = store.bodyCorperate.bodyCop.all;
  const years = store.bodyCorperate.financialYear.all;
  const months = store.bodyCorperate.financialMonth.all.map((m) => {
    return m.asJson;
  });
  const bank_accounts = store.bodyCorperate.propetyBankAccount.all.map((m) => {
    return m.asJson;
  });

  const onUpdateProperty = () => {
    showModalFromId(DIALOG_NAMES.BODY.PROPERTY_ACCOUNT);
  };
  const onUpdateYear = () => {
    showModalFromId(DIALOG_NAMES.BODY.FINANCIAL_YEAR);
  };
  const onUpdateMonth = () => {
    showModalFromId(DIALOG_NAMES.BODY.FINANCIAL_MONTH);
  };
  const onUpdateAccoount = () => {
    showModalFromId(DIALOG_NAMES.BODY.BANK_ACCOUNT_UPDATE);
  };

  //create back account
  const [accountName, setAccountName] = useState<string>("");

  const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const account: IPropertyBankAccount = {
      id: "",
      name: accountName,
      totalBalance: 0,
    };

    try {
      if (me?.property) {
        await api.body.propertyBankAccount.create(account, me.property);
      } else {
        throw new Error("Property information missing.");
      }
      SuccessfulAction(ui);
      hideModalFromId(DIALOG_NAMES.BODY.BANK_ACCOUNT);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onCreateAccount = () => {
    showModalFromId(DIALOG_NAMES.BODY.BANK_ACCOUNT);
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
                <span
                  onClick={onUpdateProperty}
                  style={{ cursor: "pointer" }}
                  className="uk-margin-right"
                >
                  {properties
                    .filter((p) => p.asJson.id === me?.property)
                    .map((p) => {
                      return p.asJson.BodyCopName;
                    })}
                </span>
                <span
                  onClick={onUpdateYear}
                  style={{ cursor: "pointer" }}
                  className="uk-margin"
                >
                  {years
                    .filter((p) => p.asJson.id === me?.year)
                    .map((p) => {
                      return p.asJson.year + "-";
                    })}
                </span>
                <span
                  onClick={onUpdateMonth}
                  style={{ cursor: "pointer" }}
                  className="uk-margin-right"
                >
                  {months
                    .filter((p) => p.month === me?.month)
                    .map((p) => {
                      return p.month.slice(-2);
                    })}
                </span>
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
                <IconButton
                  onClick={onCreateAccount}
                  uk-tooltip="Create new account"
                >
                  <AddIcon style={{ color: "white", fontSize: "16px" }} />
                </IconButton>
                <span style={{ cursor: "pointer" }} onClick={onUpdateAccoount}>
                  Bank Account Name:{" "}
                  {bank_accounts
                    .filter((p) => p.id === me?.bankAccountInUse)
                    .map((p) => {
                      return p.name;
                    })}
                </span>

                <span className="uk-margin-left">
                  Balance:{" NAD "}
                  {bank_accounts
                    .filter((p) => p.id === me?.bankAccountInUse)
                    .map((p) => {
                      return p.totalBalance.toFixed(2);
                    })}
                </span>
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
      <Modal modalId={DIALOG_NAMES.BODY.PROPERTY_ACCOUNT}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          {loading && <p>loading....</p>}
          <h5 className="uk-modal-title">Change Property Accounts</h5>
          <select
            className="uk-input"
            onChange={(e) => setPropertyId(e.target.value)}
          >
            <option value="">Select property</option>
            {properties.map((p) => (
              <option value={p.asJson.id}>{p.asJson.BodyCopName}</option>
            ))}
          </select>
          <br />
          {propertyId !== "" && (
            <IconButton onClick={() => updateDocument("property", propertyId)}>
              <UpdateIcon />
            </IconButton>
          )}
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.FINANCIAL_YEAR}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          {loading && <p>loading....</p>}
          <h5 className="uk-modal-title">Change Year</h5>
          <select
            className="uk-input"
            onChange={(e) => setYearId(e.target.value)}
          >
            <option value="">Select year</option>
            {years.map((p) => (
              <option value={p.asJson.id}>{p.asJson.year}</option>
            ))}
          </select>
          <br />
          {yearId !== "" && (
            <IconButton onClick={() => updateDocument("year", yearId)}>
              <UpdateIcon />
            </IconButton>
          )}
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.FINANCIAL_MONTH}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          {loading && <p>loading....</p>}
          <h5 className="uk-modal-title">Change Month</h5>
          <select
            className="uk-input"
            onChange={(e) => setMonthId(e.target.value)}
          >
            <option value="">Select month</option>
            {months.map((p) => (
              <option value={p.month}>{p.month.slice(-2)}</option>
            ))}
          </select>
          <br />
          {monthId !== "" && (
            <IconButton onClick={() => updateDocument("month", monthId)}>
              <UpdateIcon />
            </IconButton>
          )}
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.BANK_ACCOUNT_UPDATE}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          {loading && <p>loading....</p>}
          <h5 className="uk-modal-title">Switch Accounts</h5>
          <select
            className="uk-input"
            onChange={(e) => setAccount(e.target.value)}
          >
            <option value="">Select Account</option>
            {bank_accounts.map((p) => (
              <option value={p.id}>{p.name}</option>
            ))}
          </select>
          <br />
          {accountId !== "" && (
            <IconButton
              onClick={() => updateDocument("bankAccountInUse", accountId)}
            >
              <UpdateIcon />
            </IconButton>
          )}
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.BANK_ACCOUNT}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          <h4 className="uk-modal-title">Create New Account</h4>
          <form onSubmit={createAccount}>
            <div>
              <label>Account Name</label>
              <br />
              <br />
              <input
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="uk-input"
                placeholder="Account Name"
              />
            </div>
            <IconButton type="submit">
              <UpdateIcon />
            </IconButton>
          </form>
        </div>
      </Modal>
    </div>
  );
});

export default NavBar;
