import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { useEffect, useState } from "react";
import { Grid, Paper, styled } from "@mui/material";
import "./DashboardCard.scss";
import "./Dashtable.scss";
import MaintenanceTimeRequest from "./dashboardGraphs.tsx/MaintenananceTimeRequest";
import RequestBarChat from "./dashboardGraphs.tsx/RequestBarChart";
import Loading, { LoadingEllipsis } from "../../shared/components/Loading";
import {
  getUserName,
  getUserNameRequest,
  getUnitsRequest,
} from "../shared/common";

const Dashboard = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson?.role;

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        {me === "Owner" && <p>Owner</p>}
        {me === "Employee" && <p>Emp</p>}
        {me === "Admin" && <ManagerDashBoard />}
      </div>
    </div>
  );
});

export default Dashboard;

const OwnerDashBoard = () => {
  return <></>;
};

const ManagerDashBoard = () => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const [isLoading, setIsLoading] = useState(true);

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

  // const requests =()=>{
  //   maintenanceRequests.filter((requests)=>
  //   new Date (requests.dateRequested).getTime() < currentDate.getTime()
  //   )
  // }

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      if (me?.property && me?.year) {
        await api.communication.announcement.getAll(me.property, me.year);
        await api.maintenance.maintenance_request.getAll(me.property);
        await api.maintenance.service_provider.getAll(me.property);
        // await api.maintenance.maintenance_request.getAll(me.property); //meetings
        await api.auth.loadAll();
        await api.body.supplier.getAll(me.property);
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    getData();
  }, [
    api.auth,
    api.communication.announcement,
    api.maintenance.maintenance_request,
    api.maintenance.service_provider,
    me?.property,
    me?.year,
  ]);
  const totalNewRequests = maintenanceRequests.length;
  const totalServiceProviders = serviceProviders.length;
  const totalNewNotices = notices.length;

  const latestNotices = notices.slice(0, 3);
  const latestProviders = serviceProviders.slice(0, 3);
  const latestRequests = maintenanceRequests.slice(0, 3);

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

  return (
    <div className="uk-section leave-analytics-page dashboard-card">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="uk-container uk-container-large">
          <div className="section-toolbar uk-margin">
            <h4 className="section-heading uk-heading">Dashboard</h4>
            <div className="controls">
              <div className="uk-inline">
                {/* <button
       
                className="uk-button primary"
                type="button"
              >
                Add Supplier
              </button> */}
              </div>
            </div>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Item>
                <div className="dashboard-card">
                  <div className="uk-card">
                    <div className="uk-card-body">
                      <h3 className="uk-card-title">New Notices</h3>
                      <h3 className="number">{totalNewNotices}</h3>
                    </div>
                  </div>
                  <div className="uk-card">
                    <div className="uk-card-body">
                      <h3 className="uk-card-title">
                        New Maintenance Requests
                      </h3>
                      <h3 className="number">{totalNewRequests}</h3>
                    </div>
                  </div>
                  <div className="uk-card">
                    <div className="uk-card-body">
                      <h3 className="uk-card-title">Service Providers</h3>
                      <h3 className="number">{totalServiceProviders}</h3>
                    </div>
                  </div>
                </div>
              </Item>
            </Grid>
            <Grid item xs={12} sm={4}>
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
                              <td>{index}</td>
                              <td style={{ textTransform: "uppercase" }}>
                                {getUserNameRequest(
                                  users,
                                  maintenanceRequest,
                                  r.id
                                )}
                              </td>
                              <td>
                                {new Date(r.dateRequested).toDateString()}
                              </td>
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
                            <th>Action</th>
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
                              <td>Developer</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* <div>
                    <h4
                      className="uk-title"
                      style={{
                        textTransform: "uppercase",
                        color: "grey",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Recently Added SP's
                    </h4>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Tile</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>John Doe</td>
                            <td>Developer</td>
                            <td>Developer</td>
                          </tr>
                          <tr>
                            <td>Jane Smith</td>
                            <td>Designer</td>
                            <td>Designer</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div> */}
                </div>
              </Item>
            </Grid>
          </Grid>
          <Grid container spacing={1} style={{ marginTop: "15px" }}>
            <Grid container spacing={1}>
              <Paper style={{ width: "100%", height: "600px", padding: 20 }}>
                <div style={{ marginLeft: "-3rem" }}>
                  <RequestBarChat />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};
