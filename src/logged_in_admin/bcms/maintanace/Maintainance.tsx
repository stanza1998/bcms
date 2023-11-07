import { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import CampaignIcon from '@mui/icons-material/Campaign';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import ForumIcon from "@mui/icons-material/Forum";
import MessageIcon from "@mui/icons-material/Message";
import OverviewRequests from "./OverviewRequestsGrid";
import Loading from "../../../shared/components/Loading";
import Toolbar2 from "../../shared/Toolbar2";
import icon1 from "../../../assets/undraw_discount_d-4-bd.svg";
import { observer } from "mobx-react-lite";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

export const Maintainance = () => {
  
const { store,api } = useAppContext();
const me = store.user.meJson;
const [loading, setLoading] = useState(true);


useEffect(() => {
  const getData = async () => {
    if (me?.property) {
      await api.maintenance.maintenance_request.getAll(me.property);
      await api.maintenance.service_provider.getAll(me.property);
      setLoading(false);
    }
  };
  getData();
  //   setTimeout(() => {
  //   setLoading(false);
  // }, 1000);
}, [
  api.maintenance.maintenance_request,
  api.maintenance.service_provider,
  me?.property,
]);

const maintenanceRequests = store.maintenance.maintenance_request.all.map((reqs)=> reqs.asJson);
const serviceProviders = store.maintenance.servie_provider.all.map((reqs)=> reqs.asJson);

const filteredRequests = maintenanceRequests.sort(
  (a, b) =>
    new Date(b.dateRequested).getTime() - new Date(a.dateRequested).getTime()
);


const totalRequests = maintenanceRequests.length;
const totalClosedRequests = maintenanceRequests.filter((request)=>request.status ==="Closed").length;
const totalOpenedRequests = maintenanceRequests.filter((request )=>request.status ==="Open").length;
const totalInProgressRequests = maintenanceRequests.filter((request)=>request.status ==="In Progress").length;
// const totalDoneRequests = maintenanceRequests.filter((request)=>request.status ==="Done").length;
const totalServiceProviders = serviceProviders.length;

  return (
    <div className="uk-section leave-analytiscs-page">
    {loading ? (
        <Loading />
      ) : (
    <div className="uk-container uk-container-large">
    <h4 className="section-heading uk-heading">Overview</h4>
    <Toolbar2
        rightControls={
          <div>
            <IconButton uk-tooltip="Print invoices">
              <PrintIcon />
            </IconButton>
            <IconButton uk-tooltip="Export to pdf">
              <PictureAsPdfIcon />
            </IconButton>
            <IconButton uk-tooltip="Export to csv">
              <ArticleIcon />
            </IconButton>
          </div>
        }
      />
         <div
        className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
        data-uk-grid
      >
        <div>
          <div
            className="uk-card uk-card-default uk-card-body uk-card-small"
            style={{ background: "#000c37" }}
          >
            <h3
              className="uk-card-title"
              style={{
                color: "white",
                textTransform: "uppercase",
                fontSize: "18px",
              }}
            >
              <CampaignIcon style={{ color: "#01aced", fontSize: "34px" }} />{" "}
              Total Requests
            </h3>
            <p>{totalRequests}</p>
          </div>
        </div>
        <div>
          <div
            className="uk-card uk-card-default uk-card-body uk-card-small"
            style={{ background: "#000c37" }}
          >
            <h3
              className="uk-card-title"
              style={{
                color: "white",
                textTransform: "uppercase",
                fontSize: "18px",
              }}
            >
              <CampaignIcon style={{ color: "green", fontSize: "34px" }} />{" "}
              Total Service Providers
            </h3>
            <p>{totalServiceProviders}</p>
          </div>
        </div>
        <div>
          <div
            className="uk-card uk-card-default uk-card-body uk-card-small"
            style={{ background: "#000c37" }}
          >
            <h3
              className="uk-card-title"
              style={{
                color: "white",
                textTransform: "uppercase",
                fontSize: "18px",
              }}
            >
              <CampaignIcon style={{ color: "red", fontSize: "34px" }} />{" "}
              Total Closed Requests
            </h3>
            <p>{totalClosedRequests}</p>
          </div>
        </div>
        <div>
          <div
            className="uk-card uk-card-default uk-card-body uk-card-small"
            style={{ background: "#000c37" }}
          >
            <h3
              className="uk-card-title"
              style={{
                color: "white",
                textTransform: "uppercase",
                fontSize: "18px",
              }}
            >
              {" "}
              <ContactPhoneIcon
                style={{ color: "#01aced", fontSize: "34px" }}
              />{" "}
              Total Opened Requests
            </h3>
            <p> {totalOpenedRequests}</p>
          </div>
        </div>
        <div>
          <div
            className="uk-card uk-card-default uk-card-body uk-card-small"
            style={{ background: "#000c37" }}
          >
            <h3
              className="uk-card-title"
              style={{
                color: "white",
                textTransform: "uppercase",
                fontSize: "18px",
              }}
            >
              <ForumIcon style={{ color: "#01aced", fontSize: "34px" }} />{" "}
              Total Requests In Progress
            </h3>
            <p>{totalInProgressRequests}</p>
          </div>
        </div>
        {/* <div>
          <div
            className="uk-card uk-card-default uk-card-body uk-card-small"
            style={{ background: "#000c37" }}
          >
            <h3
              className="uk-card-title"
              style={{
                color: "white",
                textTransform: "uppercase",
                fontSize: "18px",
              }}
            >
              <MessageIcon style={{ color: "green", fontSize: "34px" }} />{" "}
              Total Requests Done
            </h3>
            <p> {totalDoneRequests}</p>
          </div>
        </div> */}
      </div>
      <div className="tool-bar"></div>
      <div style={{padding:"10px"}}>
      <OverviewRequests data={filteredRequests}/>
      </div>
    </div>
    )}
  </div>
  );
};


