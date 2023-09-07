import { observer } from "mobx-react-lite";
import { useState } from "react";
import ApartmentIcon from "@mui/icons-material/Apartment";
import RvHookupIcon from "@mui/icons-material/RvHookup";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useNavigate } from "react-router-dom";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";

export const Statements = observer(() => {
  const navigate = useNavigate();

  const toCustomerFNB = () => {
    navigate("/c/accounting/statements/customer");
  };
  const toCustomerNEDBANK = () => {
    navigate("/c/accounting/statements/customer-nedbank");
  };
  const toSupplierNEBANK = () => {
    navigate("/c/accounting/statements/supplier");
  };
  const toSupplierFNB = () => {
    navigate("/c/accounting/statements/supplier-fnb");
  };
  const toAccounts = () => {};

  const onCustomer = () => {
    showModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
  };
  const onSupplier = () => {
    showModalFromId(DIALOG_NAMES.BODY.BODY_CORPORATE_DIALOG);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Reports</h4>
          <div className="controls">
            <div className="uk-inline"></div>
          </div>
        </div>
        <div>
          <div
            className="uk-child-width-1-3@m uk-grid-small uk-grid-match sales-order"
            data-uk-grid
          >
            <div style={{ cursor: "pointer" }} onClick={onCustomer}>
              <div className="uk-card uk-card-default uk-card-body">
                <h3
                  style={{
                    textTransform: "uppercase",
                    fontSize: "14px",
                  }}
                  className="uk-card-title"
                >
                  {" "}
                  <ApartmentIcon /> Customer Transaction Report
                </h3>
              </div>
            </div>
            <div style={{ cursor: "pointer" }} onClick={onSupplier}>
              <div className="uk-card uk-card-default uk-card-body">
                <h3
                  style={{
                    textTransform: "uppercase",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  className="uk-card-title"
                >
                  <RvHookupIcon />
                  Supplier Transaction Report
                </h3>
              </div>
            </div>
            <div style={{ cursor: "pointer" }} onClick={toAccounts}>
              <div className="uk-card uk-card-default uk-card-body">
                <h3
                  style={{
                    textTransform: "uppercase",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  className="uk-card-title"
                >
                  {" "}
                  <AccountBalanceWalletIcon />
                  Accounts Transaction Report
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal modalId={DIALOG_NAMES.BODY.BODY_CORPORATE_DIALOG}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          <h3 className="uk-modal-title">Which bank? (Supplier Records)</h3>
          <ul className="uk-list uk-list-divider">
            <li>
              First National Bank{" "}
              <KeyboardTabIcon
                onClick={toSupplierFNB}
                style={{ cursor: "pointer" }}
              />
            </li>
            <li>
              NEBANK{" "}
              <KeyboardTabIcon
                onClick={toSupplierNEBANK}
                style={{ cursor: "pointer" }}
              />
            </li>
            <li>
              Bank Windhoek <KeyboardTabIcon style={{ cursor: "pointer" }} />
            </li>
          </ul>
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.ALLOCATE_DIALOGS}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          <h3 className="uk-modal-title">Which bank? (Customer Records)</h3>
          <ul className="uk-list uk-list-divider">
            <li>
              First National Bank{" "}
              <KeyboardTabIcon
                onClick={toCustomerFNB}
                style={{ cursor: "pointer" }}
              />
            </li>
            <li>
              NEDBANK{" "}
              <KeyboardTabIcon
                onClick={toCustomerNEDBANK}
                style={{ cursor: "pointer" }}
              />
            </li>
            <li>
              Bank Windhoek <KeyboardTabIcon style={{ cursor: "pointer" }} />
            </li>
          </ul>
        </div>
      </Modal>
    </div>
  );
});
