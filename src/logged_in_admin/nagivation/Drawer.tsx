import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { USER_ROLES } from "../../shared/constants/USER_ROLES";
import { useAppContext } from "../../shared/functions/Context";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import SignLanguageIcon from "@mui/icons-material/SignLanguage";
import EngineeringIcon from "@mui/icons-material/Engineering";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MoneyIcon from "@mui/icons-material/Money";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { FailedAction, SuccessfulAction } from "../../shared/models/Snackbar";
import showModalFromId, {
  hideModalFromId,
} from "../../shared/functions/ModalShow";
import DIALOG_NAMES from "../dialogs/Dialogs";
import Modal from "../../shared/components/Modal";
import { IconButton } from "@mui/material";
import { IPropertyBankAccount } from "../../shared/models/property-bank-account/PropertyBankAccount";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../shared/database/FirebaseConfig";
import { ACTIONLIST } from "./Account";

interface IImage {
  imgUrl: string | undefined;
}

export const Account = (props: IImage) => {
  return (
    <div className="brand uk-margin">
      <img src={`${props.imgUrl}`} alt="LOGO" />
    </div>
  );
};

const ADMIN_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item">
          <NavLink to={`dashboard`} className="navlink">
            <span className="uk-margin-small-right">
              <DashboardIcon style={{ fontSize: "16px" }} />
            </span>
            Dashboard
          </NavLink>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={`body`} className="navlink">
            <span className="uk-margin-small-right">
              <MapsHomeWorkIcon style={{ fontSize: "16px" }} />
            </span>
            Properties
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`body/owners`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Owners list
              </NavLink>
            </li>
            <li>
              <NavLink to={`body/body-corperate`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Customers list
              </NavLink>
            </li>
            <li>
              <NavLink to={`body/suppliers`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Suppliers list
              </NavLink>
            </li>
            <li>
              <NavLink to={`body/accountType`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Accounts list
              </NavLink>
            </li>
            <li>
              <NavLink to={`body/account-categories`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Account Categories
              </NavLink>
            </li>
            {/* <li>
              <NavLink to={`body/transfer`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Transfer
              </NavLink>
            </li> */}
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={`accounting`} className="navlink">
            <span className="uk-margin-small-right">
              <MoneyIcon style={{ fontSize: "16px" }} />
            </span>
            Accounting
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink
                to={`accounting/accounting-overview`}
                className="navlink"
              >
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={`accounting/invoices`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Customers
              </NavLink>
            </li>
            <li>
              <NavLink to={`accounting/supplier-invoices`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Suppliers
              </NavLink>
            </li>
            <li>
              <NavLink to={`accounting/account`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                General Ledger
              </NavLink>
            </li>
            <li>
              <NavLink to={`accounting/accountants-hub`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Trail Balance
              </NavLink>
            </li>
            <li>
              <NavLink to={`accounting/banking`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Banking
              </NavLink>
            </li>
            <li>
              <NavLink to={`accounting/expense-tracking`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Bank Statements
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`communication`} className="navlink">
            <span className="uk-margin-small-right">
              <SignLanguageIcon style={{ fontSize: "16px" }} />
            </span>
            Communication
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`communication/com-overview`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={`communication/announcements`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Announcements
              </NavLink>
            </li>
            <li>
              <NavLink to={`communication/private-message`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Message Board
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`communication/contact-management`}
                className="navlink"
              >
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Contacts
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`maintainance`} className="navlink">
            <span className="uk-margin-small-right">
              <EngineeringIcon style={{ fontSize: "16px" }} />
            </span>
            Maintenance
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`maintainance/main-overview`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink to={`maintainance/request`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Request
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`maintainance/service-providers`}
                className="navlink"
              >
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Service Providers
              </NavLink>
            </li>
            <li>
              <NavLink to={`maintainance/reports`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Reports
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`meetings`} className="navlink">
            <span className="uk-margin-small-right">
              <MeetingRoomIcon style={{ fontSize: "16px" }} />
            </span>
            Meetings
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`meetings/meetings-overview`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Overview
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`orders`} className="navlink">
            <span className="uk-margin-small-right">
              <DocumentScannerIcon style={{ fontSize: "16px" }} />
            </span>
            Documents
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`documents/documents-overview`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Overview
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={`admin`} className="navlink">
            <span className="uk-margin-small-right">
              <SupervisorAccountIcon style={{ fontSize: "16px" }} />
            </span>
            Admin
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`admin/employees`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Employees
              </NavLink>
            </li>
            <li>
              <NavLink to={`admin/departments`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Departments
              </NavLink>
            </li>
            <li>
              <li>
                <NavLink to={`admin/others`} className="navlink">
                  <span className="uk-margin-small-right">
                    <DoubleArrowIcon style={{ fontSize: "15px" }} />
                  </span>
                  Settings
                </NavLink>
              </li>
              <NavLink to={`admin/appearance`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Appearance
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
      <ACTIONLIST />
    </div>
  );
};

const OWNER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item">
          <NavLink to={`dashboard`} className="navlink">
            <span className="uk-margin-small-right">
              <AccountCircleIcon style={{ fontSize: "16px" }} />
            </span>
            My Overview
          </NavLink>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`unit`} className="navlink">
            <span className="uk-margin-small-right">
              <ApartmentIcon style={{ fontSize: "16px" }} />
            </span>
            My Properties
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`unit/owner-units`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                My Units
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`finanace`} className="navlink">
            <span className="uk-margin-small-right">
              <MoneyIcon style={{ fontSize: "16px" }} />
            </span>
            Finances
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`finance/invoices-view`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Invoices
              </NavLink>
            </li>
            {/* <li>
              <NavLink to={`finance/recuring-invoices-view`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Recuring Invoices
              </NavLink>
            </li> */}
            <li>
              <NavLink to={`finance/proof-of-payment`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Proof of Payment
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`finance/owner-communication`} className="navlink">
            <span className="uk-margin-small-right">
              <SignLanguageIcon style={{ fontSize: "16px" }} />
            </span>
            Communication
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            {/* <li>
              <NavLink to={`communication/com-overview`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Overview
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to={`finance/owner-communication/owner-private-message`}
                className="navlink"
              >
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Chat
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const EMPLOYEE_USER_DRAWER = () => {
  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        <li className="list-item">
          <NavLink to={`dashboard`} className="navlink">
            <span className="uk-margin-small-right">
              <DashboardIcon style={{ fontSize: "16px" }} />
            </span>
            Dashboard
          </NavLink>
        </li>

        <li className="list-item uk-parent">
          <NavLink to={`finance`} className="navlink">
            <span className="uk-margin-small-right">
              <MoneyIcon style={{ fontSize: "16px" }} />
            </span>
            Finance
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`finance/finance-overview`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Overview
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`communication`} className="navlink">
            <span className="uk-margin-small-right">
              <SignLanguageIcon style={{ fontSize: "16px" }} />
            </span>
            Communication
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`communication/com-overview`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Overview
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`maintainance`} className="navlink">
            <span className="uk-margin-small-right">
              <EngineeringIcon style={{ fontSize: "16px" }} />
            </span>
            Maintainance
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`maintainance/main-overview`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Overview
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`meetings`} className="navlink">
            <span className="uk-margin-small-right">
              <MeetingRoomIcon style={{ fontSize: "16px" }} />
            </span>
            Meetings
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`meetings/meetings-overview`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Overview
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`orders`} className="navlink">
            <span className="uk-margin-small-right">
              <DocumentScannerIcon style={{ fontSize: "16px" }} />
            </span>
            Documents
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`documents/documents-overview`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Overview
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`accounting`} className="navlink">
            <span className="uk-margin-small-right">
              <AccountBalanceIcon style={{ fontSize: "16px" }} />
            </span>
            Accounting
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink
                to={`accounting/accounting-overview`}
                className="navlink"
              >
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Orders Overview
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="list-item uk-parent">
          <NavLink to={`body`} className="navlink">
            <span className="uk-margin-small-right">
              <MapsHomeWorkIcon style={{ fontSize: "16px" }} />
            </span>
            Body Corperates
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
          <ul className="uk-nav-sub">
            <li>
              <NavLink to={`body/body-corperate`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Body Corporates
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};



const DrawerList = observer(() => {
  const { store } = useAppContext();
  const role = store.user.role;

  const adminRoles = [
    USER_ROLES.ADMIN,
    USER_ROLES.MANAGER,
    USER_ROLES.GENERAL_MANAGER,
    USER_ROLES.MANAGING_DIRECTOR,
    USER_ROLES.BOARD_MEMBER,
    USER_ROLES.DIRECTOR,
    USER_ROLES.HUMAN_RESOURCE,
    USER_ROLES.SUPERVISOR,
  ];

  if (adminRoles.includes(role)) {
    return <ADMIN_DRAWER />;
  } else if (role === USER_ROLES.EMPLOYEE || role === USER_ROLES.INTERN) {
    return <EMPLOYEE_USER_DRAWER />;
  } else if (role === USER_ROLES.OWNER) {
    return <OWNER_DRAWER />;
  }
  return <EMPLOYEE_USER_DRAWER />;
});

const Drawer = () => {
  const { store } = useAppContext();
  const imgUrl = store.settings.theme?.logoUrl;

  return (
    <div className="drawer">
      <div id="navbar-drawer" data-uk-offcanvas="overlay: true">
        <div className="uk-offcanvas-bar">
          <button
            className="uk-offcanvas-close"
            type="button"
            data-uk-close
          ></button>
          <Account imgUrl={imgUrl} />
          <DrawerList />
        </div>
      </div>
      <div className="fixed-drawer uk-visible@s">
        <Account imgUrl={imgUrl} />
        <DrawerList />
      </div>
    </div>
  );
};

export default Drawer;
