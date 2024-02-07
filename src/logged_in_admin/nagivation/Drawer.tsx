import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
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
import { ACTIONLIST } from "./Account";
import { canViewPropertyDetails } from "../shared/common";
import Modal from "../../shared/components/Modal";
import showModalFromId, {
  hideModalFromId,
} from "../../shared/functions/ModalShow";
import DIALOG_NAMES from "../dialogs/Dialogs";
import { PromptUserDialog } from "../dialogs/user-dialog/PromptUserDialog";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";

declare const UIkit: any;

interface IImage {
  imgUrl: string | undefined;
}

export const Account = observer((props: IImage) => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const navigate = useNavigate();
  const properties = store.bodyCorperate.bodyCop.all;
  const folderIds = store.communication.meetingFolder.all;
  const documentFolderIds = store.communication.documentCategory.all;

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.body.body.getAll();
        await api.body.propertyBankAccount.getAll(me.property);
        await api.body.financialYear.getAll(me.property);
        await api.communication.announcement.getAll(me.property, "");
      } else if (me?.property && folderIds) {
        for (const folderId of folderIds) {
          await api.communication.meetingFolder.getById(
            folderId.asJson.id,
            me.property
          );
          await api.communication.meeting.getAll(
            me.property,
            folderId.asJson.id
          );
        }
      } else if (me?.property && documentFolderIds) {
        for (const documentFolderId of documentFolderIds) {
          await api.communication.documentCategory.getAll(
            me.property
          );
          await api.communication.documentFile.getAll(
            me.property,
            documentFolderId.asJson.id
          );
        }
      } else if (me?.property === "") {
      }
    };

    getData();
  }, [
    api.body.body,
    api.body.financialMonth,
    api.body.financialYear,
    api.communication.announcement,
    api.communication.documentCategory,
    api.communication.documentFile,
    api.body.propertyBankAccount,
    api.communication.meeting,
    api.communication.meetingFolder,
    me?.property,
    me?.year,
  ]);

  useEffect(() => {
    const openUpdateUserDialog = () => {
      if (me?.firstName.length === 0 && me.lastName.length === 0) {
        navigate("/c/settings");
      } else {
      }
    };
    openUpdateUserDialog();
  }, []);

  return (
    <div className="brand uk-margin">
      <img src={`${props.imgUrl}`} alt="L5OGO" />
      <div style={{ margin: "30px" }}>
        <span
          className="uk-margin-right"
          style={{
            textTransform: "uppercase",
            background: "#000c37",
            padding: "3px",
            borderRadius: "3px",
            color: "white",
            fontSize: "9px",
          }}
        >
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
      </div>
    </div>
  );
});

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
                Properties list
              </NavLink>
            </li>
            {/* <li>
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
            </li> */}
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

        {/* <li className="list-item uk-parent">
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
        </li> */}
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
              <NavLink to={`communication/notices`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Notices
              </NavLink>
            </li>
            {/* <li>
              <NavLink to={`communication/private-message`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Message Board
              </NavLink>
            </li> */}
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
            <li>
              <NavLink to={`communication/meetings`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Meetings and Minutes
              </NavLink>
              <NavLink to={`communication/documents`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Documents
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
            {/* <li>
              <NavLink
                to={`service-provider/requests`}
                className="navlink"
              >
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Service Provider Requests
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink to={`maintainance/reports`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Reports
              </NavLink>
            </li> */}
          </ul>
        </li>
        {/* <li className="list-item uk-parent">
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
        </li> */}

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
              {/* <li>
                <NavLink to={`admin/others`} className="navlink">
                  <span className="uk-margin-small-right">
                    <DoubleArrowIcon style={{ fontSize: "15px" }} />
                  </span>
                  Settings
                </NavLink>
              </li> */}
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
      <Modal modalId={DIALOG_NAMES.SETTINGG.USER_DETAILS_PROMPT}>
        <PromptUserDialog />
      </Modal>
    </div>
  );
};

const OWNER_DRAWER = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const currentDate = new Date();
  const units = store.bodyCorperate.unit.all.map((u) => u.asJson);
  const announcements = store.communication.announcements.all.map((a) => {
    return a.asJson;
  });

  
  const documents = store.communication.documentFile.all;

  const meetings = store.communication.meeting.all.map((meeting) => {
    return meeting.asJson;
  });
  const folderIdCounts: Record<string, number> = meetings.reduce(
    (counts, meeting) => {
      // Check if the 'seen' property includes 'me?.uid'
      const seenByCurrentUser = !meeting.seen?.includes(me?.uid || "");
      // If not seen by current user, increment count
      if (seenByCurrentUser) {
        const folderId = meeting.folderId;
        counts[folderId] = (counts[folderId] || 0) + 1;
      }
      return counts;
    },
    {} as Record<string, number> // Initial value with correct type annotation
  );
  const documentFolderIdCounts: Record<string, number> = documents.reduce(
    (counts, document) => {
      // Check if the 'seen' property includes 'me?.uid'
      const seenByCurrentUser = !document.asJson.seen?.includes(me?.uid || "");
      // If not seen by current user, increment count
      if (seenByCurrentUser) {
        const folderId = document.asJson.fid;
        counts[folderId] = (counts[folderId] || 0) + 1;
      }
      return counts;
    },
    {} as Record<string, number> // Initial value with correct type annotation
  );
  const totalDocumentCount = Object.values(documentFolderIdCounts).reduce(
    (acc, count) => acc + count,
    0
  );
  console.log("Check Documents", documents);
  console.log("Check Documents count " + totalDocumentCount);

  const latestAnnouncement = announcements.filter((an) => {
    const expiryDate = new Date(an.expiryDate);
    const timestamp = expiryDate.getTime();
    const currentTimestamp = Date.now();
    const userId = me?.uid || "";
    return timestamp > currentTimestamp && !an.seen.includes(userId);
  });

  // const latestMeeting = meetings.filter((an) => {
  //   const dateCreated = new Date(an.dateCreate);
  //   const timestamp = dateCreated.getTime();
  //   const currentTimestamp = Date.now();
  //   const userId = me?.uid || "";
  //   return timestamp > currentTimestamp && !an.seen.includes(userId);
  // });
  // console.log("Latest Meetings", latestMeeting);

  const active = latestAnnouncement.filter(
    (a) => new Date(a.expiryDate) >= new Date(currentDate)
  ).length;

  // const activeMeetings = latestMeeting.filter(
  //   (meeting) => new Date(meeting.endDateAndTime) >= new Date(currentDate)
  // ).length;
  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.unit.getAll(me.property);
      }
    };
    getData();
  }, [api.unit, me?.property]);

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
        {/* <li className="list-item uk-parent">
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
           <li>
              <NavLink to={`finance/recuring-invoices-view`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Recuring Invoices
              </NavLink>
            </li> 
            <li>
              <NavLink to={`finance/proof-of-payment`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Proof of Payment
              </NavLink>
            </li>
          </ul>
        </li> */}
        {me?.role === "Owner" &&
        canViewPropertyDetails(me?.uid || "", units) ? (
          <>
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
                {/* <Badge badgeContent={active} color="secondary">
                  <NotificationsIcon style={{ color: "white" }} />
                </Badge> */}
              </NavLink>
              <ul className="uk-nav-sub">
                <li>
                  <NavLink
                    to={`communication/com-overview`}
                    className="navlink"
                  >
                    <span className="uk-margin-small-right">
                      <DoubleArrowIcon style={{ fontSize: "15px" }} />
                    </span>
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`communication/notices`} className="navlink">
                    <span className="uk-margin-small-right">
                      <DoubleArrowIcon style={{ fontSize: "15px" }} />
                    </span>
                    Notices
                    {latestAnnouncement.length != 0 &&
                    latestAnnouncement.some(
                      (item) => !item.seen.includes(me?.uid)
                    ) ? (
                      <Badge badgeContent={active} color="secondary">
                        <NotificationsIcon style={{ color: "white" }} />
                      </Badge>
                    ) : null}
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`communication/meetings`} className="navlink">
                    <span className="uk-margin-small-right">
                      <DoubleArrowIcon style={{ fontSize: "15px" }} />
                    </span>
                    Meetings and Minutes
                    {meetings.length != 0 &&
                    meetings.some((item) => !item.seen.includes(me?.uid)) ? (
                      <Badge
                        badgeContent={Object.values(folderIdCounts).reduce(
                          (acc, count) => acc + count,
                          0
                        )}
                        color="secondary"
                      >
                        <NotificationsIcon style={{ color: "white" }} />
                      </Badge>
                    ) : null}
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`communication/documents`} className="navlink">
                    <span className="uk-margin-small-right">
                      <DoubleArrowIcon style={{ fontSize: "15px" }} />
                    </span>
                    Documents
                    {documents.length != 0 &&
                    documents.some((item) => !item.asJson.seen.includes(me?.uid)) ? (
                      <Badge badgeContent={totalDocumentCount} color="secondary">
                      <NotificationsIcon style={{ color: "white" }} />
                    </Badge>
                    ) : null}
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
                  <NavLink
                    to={`maintainance/main-overview`}
                    className="navlink"
                  >
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
                {/* <li>
              <NavLink
                to={`maintainance/service-providers`}
                className="navlink"
              >
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Service Providers
              </NavLink>
            </li> */}
                {/* <li>
              <NavLink to={`maintainance/reports`} className="navlink">
                <span className="uk-margin-small-right">
                  <DoubleArrowIcon style={{ fontSize: "15px" }} />
                </span>
                Reports
              </NavLink>
            </li> */}
              </ul>
            </li>
          </>
        ) : (
          <span style={{ color: "red" }}>No units</span>
        )}
      </ul>
      <Modal modalId={DIALOG_NAMES.SETTINGG.USER_DETAILS_PROMPT}>
        <PromptUserDialog />
      </Modal>
    </div>
  );
});

const SERVICE_PROVIDER_DRAWER = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const units = store.bodyCorperate.unit.all.map((u) => u.asJson);

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.unit.getAll(me.property);
      }
    };
    getData();
  }, [api.unit, me?.property]);

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
          <NavLink
            to={`service-provider/work-orders/:maintenanceRequestId`}
            className="navlink"
          >
            <span className="uk-margin-small-right">
              <MoneyIcon style={{ fontSize: "16px" }} />
            </span>
            Work Orders
            <span
              style={{ fontSize: "5px" }}
              className="down-arrow"
              data-uk-icon="triangle-down"
            />
          </NavLink>
        </li>
      </ul>
    </div>
  );
});

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
  ];

  if (adminRoles.includes(role)) {
    return <ADMIN_DRAWER />;
  } else if (role === USER_ROLES.EMPLOYEE || role === USER_ROLES.INTERN) {
    return <EMPLOYEE_USER_DRAWER />;
  } else if (role === USER_ROLES.OWNER) {
    return <OWNER_DRAWER />;
  } else if (role === USER_ROLES.SERVICE_PROVIDER) {
    return <SERVICE_PROVIDER_DRAWER />;
  }
  return <EMPLOYEE_USER_DRAWER />;
});

const Drawer = () => {
  const { store } = useAppContext();
  const imgUrl = store.settings.theme?.logoUrl;
  const navigate = useNavigate();
  const location = useLocation();

  // Your existing JSX for the Drawer component
  // ...

  useEffect(() => {
    const closeOffcanvasOnRouteChange = () => {
      // Assuming UIkit is available globally
      const offcanvasElement = UIkit.offcanvas("#navbar-drawer");
      if (offcanvasElement) {
        offcanvasElement.hide();
      }

      window.scrollTo(0, 0);
    };
    // Call your function when the pathname changes
    closeOffcanvasOnRouteChange();
  }, [location.pathname]);

  return (
    <div className="drawer" style={{ background: "white" }}>
      <div
        id="navbar-drawer"
        data-uk-offcanvas="overlay: true"
        style={{ background: "white" }}
      >
        <div className="uk-offcanvas-bar" style={{ background: "white" }}>
          <button
            className="uk-offcanvas-close"
            type="button"
            data-uk-close
          ></button>
          <Account imgUrl={imgUrl} />
          <DrawerList />
          <ACTIONLIST />
        </div>
      </div>
      <div className="fixed-drawer uk-visible@s">
        <Account imgUrl={imgUrl} />
        <DrawerList />
        <ACTIONLIST />
      </div>
    </div>
  );
};

export default Drawer;
