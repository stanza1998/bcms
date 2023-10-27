import { useEffect } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import CampaignIcon from '@mui/icons-material/Campaign';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import RequestGrid from "./request/grid/RequestGrid";
import { IMaintenanceRequest } from "../../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";
import { IServiceProvider } from "../../../shared/models/maintenance/service-provider/ServiceProviderModel";
import ForumIcon from "@mui/icons-material/Forum";
import MessageIcon from "@mui/icons-material/Message";

export const Maintainance = () => {
  
const { store, api } = useAppContext();
const me = store.user.meJson;

const requests = store.maintenance.maintenance_request.all.map((a: { asJson: IMaintenanceRequest; }) => {
  return a.asJson;
});
const serviceProviders = store.maintenance.service_provider.all.map((a: { asJson: IServiceProvider; }) => {
  return a.asJson;
});

const totalRequests = requests.length;
const totalClosedRequests = requests.filter((request)=>request.status ==="Closed").length;
const totalOpenedRequests = requests.filter((request )=>request.status ==="Open").length;
const totalInProgressRequests = requests.filter((request)=>request.status ==="In Progress").length;
const totalDoneRequests = requests.filter((request)=>request.status ==="Done").length;
const totalServiceProviders = serviceProviders.length;

useEffect(() => {
  const getData = async () => {
    if (me?.property) {
      await api.maintenance.maintenance_request.getAll(me.property);
      await api.maintenance.service_provider.getAll(me.property);
    }
  };
  getData();
}, [
  api.maintenance.maintenance_request,
  api.maintenance.service_provider,
  me?.property,
]);
  return (
    <div className="uk-section leave-analytics-page">
    <div className="uk-container uk-container-large">
      <div
        className="uk-child-width-1-2@m uk-grid-small uk-grid-match"
        data-uk-grid
      >
        <div>
          <div
            className="uk-card uk-card-default uk-card-body"
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
            className="uk-card uk-card-default uk-card-body"
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
            className="uk-card uk-card-default uk-card-body"
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
            className="uk-card uk-card-default uk-card-body"
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
            className="uk-card uk-card-default uk-card-body"
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
        <div>
          <div
            className="uk-card uk-card-default uk-card-body"
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
        </div>
      </div>
    </div>
    {/* <RequestGrid data={requests}/> */}
  </div>
  );
};


