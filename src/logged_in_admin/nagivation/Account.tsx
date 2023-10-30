import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import showModalFromId, { hideModalFromId } from "../../shared/functions/ModalShow";
import DIALOG_NAMES from "../dialogs/Dialogs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../shared/database/FirebaseConfig";
import { FailedAction, SuccessfulAction } from "../../shared/models/Snackbar";
import { IPropertyBankAccount } from "../../shared/models/property-bank-account/PropertyBankAccount";
import Modal from "../../shared/components/Modal";

export const ACTIONLIST = observer(() => {
    const { store, api, ui } = useAppContext();
    const me = store.user.meJson;
    const [propertyId, setPropertyId] = useState<string>("");
    const [yearId, setYearId] = useState<string>("");
    const [monthId, setMonthId] = useState<string>("");
    const [accountId, setAccount] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
  
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
  
    const onCreateAccount = () => {
      showModalFromId(DIALOG_NAMES.BODY.BANK_ACCOUNT);
    };
  
    const properties = store.bodyCorperate.bodyCop.all;
    const years = store.bodyCorperate.financialYear.all;
    const months = store.bodyCorperate.financialMonth.all.map((m) => {
      return m.asJson;
    });
  
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
          if (me?.year === "") {
            showModalFromId(DIALOG_NAMES.BODY.FINANCIAL_YEAR);
          }
        } else if (me?.property === "") {
          showModalFromId(DIALOG_NAMES.BODY.PROPERTY_ACCOUNT);
        }
      };
      getData();
    }, [
      api.body.body,
      api.body.financialMonth,
      api.body.financialYear,
      api.body.propertyBankAccount,
      api.communication.announcement,
      me?.property,
      me?.year,
    ]);
  
    useEffect(() => {
      const getData = async () => {
        if (me?.property && me?.year) {
          await api.communication.announcement.getAll(me.property, me.year);
          await api.body.financialMonth.getAll(me.property, me.year);
        }
      };
      getData();
    });
  
    //
    //create back account
    const bank_accounts = store.bodyCorperate.propetyBankAccount.all.map((m) => {
      return m.asJson;
    });
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
  
    return (
      <>
        <div className="uk-margin">
          <div className="uk-margin-left">
            <button
              onClick={onUpdateProperty}
              className="uk-button primary"
              style={{ width: "85%" }}
            >
              Switch Property
            </button>
          </div>
        </div>
        <div className="uk-margin">
          <div className="uk-margin-left">
            <button
              onClick={onUpdateYear}
              className="uk-button primary"
              style={{ width: "85%" }}
            >
              Switch FY
            </button>
          </div>
        </div>
        <div className="uk-margin">
          <div className="uk-margin-left">
            <button
              onClick={onUpdateMonth}
              className="uk-button primary"
              style={{ width: "85%" }}
            >
              Switch Month
            </button>
          </div>
        </div>
        <div className="uk-margin">
          <div className="uk-margin-left">
            <button
              onClick={onUpdateAccoount}
              className="uk-button primary"
              style={{ width: "85%" }}
            >
              Switch Bank
            </button>
          </div>
        </div>
        <div className="uk-margin">
          <div className="uk-margin-left">
            <button
              onClick={onCreateAccount}
              className="uk-button primary"
              style={{ width: "85%" }}
            >
              Create Bank
            </button>
          </div>
        </div>
        <Modal modalId={DIALOG_NAMES.BODY.PROPERTY_ACCOUNT}>
          <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
            <button
              className="uk-modal-close-default"
              type="button"
              data-uk-close
            ></button>
            <h5 className="uk-modal-title">Select Property</h5>
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
              <button
                onClick={() => updateDocument("property", propertyId)}
                className="uk-button primary uk-margin"
              >
                Save
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
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
            <h5 className="uk-modal-title">Select Year</h5>
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
              <button
                onClick={() => updateDocument("year", yearId)}
                className="uk-button primary uk-margin"
              >
                Save
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
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
            <h5 className="uk-modal-title">Select Month</h5>
            <select
              className="uk-input"
              onChange={(e) => setMonthId(e.target.value)}
            >
              <option value="">Select Month</option>
              {months.map((p) => (
                <option value={p.month}>{p.month.slice(-2)}</option>
              ))}
            </select>
            <br />
            {monthId !== "" && (
              <button
                onClick={() => updateDocument("month", monthId)}
                className="uk-button primary uk-margin"
              >
                Save
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
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
            <h5 className="uk-modal-title">Select Accounts</h5>
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
              <button
                onClick={() => updateDocument("bankAccountInUse", accountId)}
                className="uk-button primary uk-margin"
              >
                Save
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
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
              <button type="submit" className="uk-button primary uk-margin">
                Save
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </form>
          </div>
        </Modal>
      </>
    );
  });