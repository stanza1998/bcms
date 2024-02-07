import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { useEffect, useMemo, useState } from "react";
import { Grid, IconButton, Paper, styled } from "@mui/material";
import "./DashboardCard.scss";
import "./Dashtable.scss";

import Loading from "../../shared/components/Loading";
import {
  getUserName,
  getUserNameRequest,
  cannotCreateNotices,
  cannotCreateSP,
  cannotCreateMeetingFolder,
  cannotCreateDocumentFolder,
  canViewPropertyDetails,
} from "../shared/common";
import { AnnouncementDistribution } from "./dashboardGraphs.tsx/AnnouncementDistrunbution";
import { MaintenananceRequestChart } from "./dashboardGraphs.tsx/MaintenaceRequestChart";
import showModalFromId from "../../shared/functions/ModalShow";
import DIALOG_NAMES from "../dialogs/Dialogs";
import Modal from "../../shared/components/Modal";
import { AnnouncementDialog } from "../dialogs/communication-dialogs/announcements/AnnouncementDialog";
import { MaintenanceRequestDialog } from "../dialogs/maintenance/maintenance-request/MaintenanceRequestDialog";
import { OwnerRequestDialog } from "../dialogs/maintenance/maintenance-request/OwnerRequestDialog";
import { ServiceProviderDialog } from "../dialogs/maintenance/maintenance-request/ServiceProviderDialog";
import { MeetingFolderDialog } from "../dialogs/communication-dialogs/meetings/MeetingFolderDialog";
import { DocumentCategoryDialog } from "../dialogs/communication-dialogs/documents/DocumentCategories";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { NoUnit } from "../shared/no-unit-shared/NoUnit";
import { ServiceProviderView } from "../bcms/maintanace/service-providers/ServiceProviderPage";

const Dashboard = observer(() => {
  const { store } = useAppContext();
  const me = store.user.meJson;

  const units = store.bodyCorperate.unit.all.map((u) => u.asJson);

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        {me?.role === "Owner" &&
        canViewPropertyDetails(me?.uid || "", units) ? (
          <ManagerDashBoard />
        ) : me?.role === "Admin" ? (
          <ManagerDashBoard />
        ) : me?.role === "Service Provider" ? (
          <ServiceProviderView />
        ) : (
          <NoUnit />
        )}
      </div>
    </div>
  );
});

export default Dashboard;

const ManagerDashBoard = observer(() => {
  const { store } = useAppContext();
  const me = store.user.meJson;
  const navigate = useNavigate();

  if (me?.firstName === "" && me?.lastName === "") {
    console.log("Show dialog to prompt");
  }
  const closed = store.maintenance.maintenance_request.all.filter(
    (a) => a.asJson.status === "Closed"
  ).length;
  const opened = store.maintenance.maintenance_request.all.filter(
    (a) => a.asJson.status === "Opened"
  ).length;
  const completed = store.maintenance.maintenance_request.all.filter(
    (a) => a.asJson.status === "Completed"
  ).length;

  const low = store.communication.announcements.all.filter(
    (a) => a.asJson.priorityLevel === "LOW"
  ).length;
  const medium = store.communication.announcements.all.filter(
    (a) => a.asJson.priorityLevel === "MEDIUM"
  ).length;
  const high = store.communication.announcements.all.filter(
    (a) => a.asJson.priorityLevel === "HIGH"
  ).length;

  const notices = store.communication.announcements.all
    .map((announcement) => {
      return announcement.asJson;
    })
    .sort(
      (a, b) =>
        new Date(b.dateAndTime).getTime() - new Date(a.dateAndTime).getTime()
    );

  const maintenanceRequests = store.maintenance.maintenance_request.all
    .map((request) => {
      return request.asJson;
    })
    .sort(
      (a, b) =>
        new Date(b.dateRequested).getTime() -
        new Date(a.dateRequested).getTime()
    )
    .filter((requests) => requests.status === "Closed");

  const serviceProviders = store.maintenance.servie_provider.all
    .map((provider) => {
      return provider.asJson;
    })
    .sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );

  const totalNewRequests = maintenanceRequests.length;
  const totalServiceProviders = serviceProviders.length;
  const totalNewNotices = notices.length;
  const totalUnits = store.bodyCorperate.unit.all.filter(
    (units) => units.asJson.ownerId === me?.uid
  ).length;
  const totalMeetings = store.communication.meetingFolder.all.length;
  const totalDocuments = store.communication.documentCategory.all.length;
  const totalEstateUnits = store.bodyCorperate.unit.all.length;

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const maintenanceRequest = store.maintenance.maintenance_request.all
    .sort(
      (a, b) =>
        new Date(b.asJson.dateRequested).getTime() -
        new Date(a.asJson.dateRequested).getTime()
    )
    .slice(0, 2)
    .map((r) => {
      return r.asJson;
    });
  const notces = store.communication.announcements.all
    .sort(
      (a, b) =>
        new Date(b.asJson.dateAndTime).getTime() -
        new Date(a.asJson.dateAndTime).getTime()
    )
    .slice(0, 2)
    .map((r) => {
      return r.asJson;
    });

  const users = store.user.all.map((u) => u.asJson);

  const onCreateNotice = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG);
  };
  const onCreateRequest = () => {
    if (me?.role === "Owner") {
      showModalFromId(DIALOG_NAMES.OWNER.CREATE_REQUEST);
    } else {
      showModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_MAINTENANCE_REQUEST);
    }
  };
  const onCreateSP = () => {
    showModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_SERVICE_PROVIDER);
  };
  const onViewBalances = () => {
    alert("function to direct to units and balances overview");
  };
  const onCreateMeetingFolder = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_FOLDER);
  };
  const onCreateDocumentFolder = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_DOCUMENT_CATEGORY);
  };
  const onNavigateToNotices = () => {
    navigate("/c/communication/notices");
  };
  const onNavigateToUnits = () => {
    navigate("/c/unit/owner-units");
  };
  const onNavigateToProperty = () => {
    navigate("/c/body/body-corperate");
  };
  const onNavigateToRequests = () => {
    navigate("/c/maintainance/request");
  };

  const onNavigateToMeetingFolders = () => {
    navigate("/c/communication/meetings");
  };
  const onNavigateToDocumentFolders = () => {
    navigate("/c/communication/documents");
  };
  const onNavigateToServiceProviders = () => {
    navigate("/c/maintainance/service-providers");
  };
  //navigation

  const toCom = () => {
    navigate("/c/communication/com-overview");
  };

  const toMain = () => {
    navigate("/c/maintainance/main-overview");
  };

  return (
    <div className="uk-section leave-analytics-page dashboard-card">
      <div className="uk-container uk-container-large">
        <div
          className="section-toolbar uk-margin"
          style={{ marginTop: "-5rem" }}
        >
          <h4 className="section-heading uk-heading">Dashboard</h4>
          <div className="controls">
            <div className="uk-inline"></div>
          </div>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Item>
              <div className="dashboard-card">
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <div
                      className="uk-card"
                      onClick={
                        me?.role === "Owner"
                          ? onNavigateToUnits
                          : onNavigateToProperty
                      }
                    >
                      <div className="uk-card-body">
                        <h3 className="uk-card-title">Total Units</h3>
                        <h3 className="number">
                          {me?.role === "Owner" ? totalUnits : totalEstateUnits}
                        </h3>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <div className="uk-card">
                      <div className="button-section">
                        {cannotCreateNotices(me?.role || "") && (
                          <button onClick={onCreateNotice}>Create</button>
                        )}
                      </div>
                      <div
                        className="uk-card-body"
                        onClick={onNavigateToNotices}
                      >
                        <h3 className="uk-card-title">New Notices</h3>
                        <h3 className="number">{totalNewNotices}</h3>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <div className="uk-card">
                      <div className="button-section">
                        <button onClick={onCreateRequest}>Create</button>
                      </div>
                      <div
                        className="uk-card-body"
                        onClick={onNavigateToRequests}
                      >
                        <h3 className="uk-card-title">New Requests</h3>
                        <h3 className="number">{totalNewRequests}</h3>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    {
                      me?.role === "Owner" ? (
                        <div className="uk-card">
                          <div className="button-section">
                            <button onClick={onViewBalances}>View</button>
                          </div>
                          <div className="uk-card-body">
                            <h3 className="uk-card-title">Balances Due</h3>
                            <h3 className="number">N${0}</h3>
                          </div>
                        </div>
                      ) : (
                        <div className="uk-card">
                          <div className="button-section">
                            {cannotCreateSP(me?.role || "") && (
                              <button onClick={onCreateSP}>Create</button>
                            )}
                          </div>
                          <div
                            className="uk-card-body"
                            onClick={onNavigateToServiceProviders}
                          >
                            <h3 className="uk-card-title">Service Providers</h3>
                            <h3 className="number">{totalServiceProviders}</h3>
                          </div>
                        </div>
                      ) // or <></> for an empty fragment
                    }
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <div className="uk-card">
                      <div className="button-section">
                        {cannotCreateMeetingFolder(me?.role || "") && (
                          <button onClick={onCreateMeetingFolder}>
                            Create
                          </button>
                        )}
                      </div>
                      <div
                        className="uk-card-body"
                        onClick={onNavigateToMeetingFolders}
                      >
                        <h3 className="uk-card-title">Meeting Folders</h3>
                        <h3 className="number">{totalMeetings}</h3>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <div className="uk-card">
                      <div className="button-section">
                        {cannotCreateDocumentFolder(me?.role || "") && (
                          <button onClick={onCreateDocumentFolder}>
                            Create
                          </button>
                        )}
                      </div>
                      <div
                        className="uk-card-body"
                        onClick={onNavigateToDocumentFolders}
                      >
                        <h3 className="uk-card-title">Documents</h3>
                        <h3 className="number">{totalDocuments}</h3>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Item>
            <Item>
              <div className="dash-table">
                <div>
                  <h4
                    className="uk-title"
                    style={{
                      textTransform: "uppercase",
                      color: "grey",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Latest Request
                  </h4>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Owner</th>
                          <th>Date request</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maintenanceRequest.map((r, index) => (
                          <tr key={r.id}>
                            <td>{index + 1}</td>
                            <td style={{ textTransform: "uppercase" }}>
                              {getUserNameRequest(
                                users,
                                maintenanceRequest,
                                r.id
                              )}
                            </td>
                            <td>{new Date(r.dateRequested).toDateString()}</td>
                            <td>{r.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="uk-margin">
                  <h4
                    className="uk-title"
                    style={{
                      textTransform: "uppercase",
                      color: "grey",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Latest Notices
                  </h4>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Created By</th>
                          <th>Priority Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notces.map((notice, index) => (
                          <tr className="row" key={notice.id}>
                            <td className="id">{index + 1}</td>
                            <td
                              className="owner"
                              style={{ textTransform: "uppercase" }}
                            >
                              {getUserName(users, notices, notice.id)}
                            </td>
                            <td className="owner">{notice.priorityLevel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Item>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Item>
              <Grid
                container
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <h4 style={{ margin: "8px" }}>
                    Notice Priority Distribution Chart{" "}
                    <IconButton onClick={toCom} data-uk-tooltip="More details">
                      <MoreVertIcon />
                    </IconButton>
                  </h4>
                </Grid>
                <Grid item xs={12}>
                  <Paper>
                    <AnnouncementDistribution
                      low={low}
                      medium={medium}
                      high={high}
                    />
                  </Paper>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12}>
                  <h4 style={{ margin: "8px" }}>
                    Maintenance Request Status Chart{" "}
                    <IconButton onClick={toMain} data-uk-tooltip="More details">
                      <MoreVertIcon />
                    </IconButton>
                  </h4>
                </Grid>
                <Grid item xs={12}>
                  <Paper>
                    <MaintenananceRequestChart
                      closed={closed}
                      opened={opened}
                      completed={completed}
                    />
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={1}></Grid>
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "15px" }}></Grid>

        <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG}>
          <AnnouncementDialog />
        </Modal>
        <Modal modalId={DIALOG_NAMES.MAINTENANCE.CREATE_MAINTENANCE_REQUEST}>
          <MaintenanceRequestDialog />
        </Modal>
        <Modal modalId={DIALOG_NAMES.OWNER.CREATE_REQUEST}>
          <OwnerRequestDialog />
        </Modal>
        <Modal modalId={DIALOG_NAMES.MAINTENANCE.CREATE_SERVICE_PROVIDER}>
          <ServiceProviderDialog />
        </Modal>
        <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_FOLDER}>
          <MeetingFolderDialog />
        </Modal>
        <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_DOCUMENT_CATEGORY}>
          <DocumentCategoryDialog />
        </Modal>
      </div>
    </div>
  );
});
