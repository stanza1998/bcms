import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { useState } from "react";
import { Grid, Paper, styled } from "@mui/material";
import "./DashboardCard.scss";
import "./Dashtable.scss";
import MaintenanceTimeRequest from "./dashboardGraphs.tsx/MaintenananceTimeRequest";
import RequestBarChat from "./dashboardGraphs.tsx/RequestBarChart";

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
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <div className="uk-section leave-analytics-page dashboard-card">
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
                    <h3 className="number">40</h3>
                  </div>
                </div>
                <div className="uk-card">
                  <div className="uk-card-body">
                    <h3 className="uk-card-title">New Maintenance Requests</h3>
                    <h3 className="number">40</h3>
                  </div>
                </div>
                <div className="uk-card">
                  <div className="uk-card-body">
                    <h3 className="uk-card-title">Scheduled Meetings</h3>
                    <h3 className="number">40</h3>
                  </div>
                </div>
                <div className="uk-card">
                  <div className="uk-card-body">
                    <h3 className="uk-card-title">Service Providers</h3>
                    <h3 className="number">40</h3>
                  </div>
                </div>
              </div>
              <Paper style={{ width: "100%", height: "600px", padding: 20 }}>
                <RequestBarChat />
              </Paper>
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
                    New Request
                  </h4>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Tile</th>
                          <th>Status</th>
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
                    New Notices
                  </h4>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Tile</th>
                          <th>Status</th>
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
                </div>
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
                    Recently Added SP's
                  </h4>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Tile</th>
                          <th>Status</th>
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
                    Recently Added Contacts
                  </h4>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Tile</th>
                          <th>Status</th>
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
                </div>
              </div>
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: "15px" }}>
          <Grid container spacing={1}>
            <Paper style={{ width: "100%", height: "600px", padding: 20 }}>
              <MaintenanceTimeRequest />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
