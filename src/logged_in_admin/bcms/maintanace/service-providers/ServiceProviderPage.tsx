// MyComponent.jsx
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import { Grid, Paper, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  canViewMaintenanceRequestDetails,
  canViewPropertyDetails,
  getUnitsRequestOwner,
} from "../../../shared/common";
import Pagination from "../../../shared/PaginationComponent";
import { NoUnit } from "../../../shared/no-unit-shared/NoUnit";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import { NoRequests } from "../../../shared/service-provider-requests/NoRequests";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { IMaintenanceRequest } from "../../../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";
import { MaintenanceRequestDialog } from "../../../dialogs/maintenance/maintenance-request/MaintenanceRequestDialog";
import Modal from "../../../../shared/components/Modal";
import { ViewWorkOrderDialog } from "../../../dialogs/maintenance/maintenance-request/ViewWorkOrder";
import { IWorkOrderFlow } from "../../../../shared/models/maintenance/request/work-order-flow/WorkOrderFlow";
import { SPWorkOrderFlowDialog } from "../../../dialogs/maintenance/maintenance-request/SPWorkOrderDialog";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export const ServiceProviderView = observer(() => {
  const { store, api } = useAppContext();
  const { maintenanceRequestId } = useParams();
  const propertyId = store.maintenance.work_flow_order.all.map((property) => {
    return property.asJson.propertyId;
  });
  const [searchTerm, setSearchTerm] = useState<number>();
  const me = store.user.meJson;
  const navigate = useNavigate();
  console.log("My propertyId's: ", propertyId);
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const users = store.user.all.map((u) => {
    return u.asJson;
  });

  const viewWorkOrderFlow = (maintenanceRequest: IMaintenanceRequest) => {
    console.log(maintenanceRequest);
    store.maintenance.maintenance_request.select(maintenanceRequest);
    showModalFromId(DIALOG_NAMES.MAINTENANCE.VIEW_WORK_ORDER_SP); //create update dialog
  };
  /*
Save Service Providers as us 
  */
  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.maintenance.maintenance_request.getAll(me.property);
        await api.maintenance.service_provider.getAll(me.property);
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
  useEffect(() => {
    const getData = async () => {
      if (me?.property && maintenanceRequestId) {
        await api.maintenance.work_flow_order.getAll(
          me.property,
          maintenanceRequestId
        );
      }
    };
    getData();
  }, [api.maintenance.work_flow_order, maintenanceRequestId, me?.property]);

  // useEffect(() => {
  //   const getData = async () => {
  //     if(propertyId)return
  //     await api.body.body.getAll();
  //     await api.maintenance.service_provider.getAllProviders(propertyId);
  //     await api.maintenance.maintenance_request.getAllRequests(propertyId);
  //     await api.auth.loadAll();
  //   };
  //   getData();
  // }, [api.body.body, api.unit,api.maintenance.service_provider]);

  const onView = () => {
    showModalFromId(DIALOG_NAMES.BODY.OWNER_UNIT_VIEW);
  };

  const workFlowOrders = store.maintenance.work_flow_order.all
    .sort(
      (a, b) =>
        new Date(b.asJson.dateCreated).getTime() -
        new Date(a.asJson.dateCreated).getTime()
    )
    .filter((a) => a.asJson.requestId === maintenanceRequestId)
    .map((a) => {
      return a.asJson;
    });

  const maintenanceRequests = store.maintenance.maintenance_request.all.map(
    (reqs) => reqs.asJson
  );

  console.log("My Maintenance Requests: ", maintenanceRequests);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3; // Adjust as needed

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(maintenanceRequests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const lowercaseSearchTerm = searchTerm;

  const filteredRequests = maintenanceRequests.filter((u) => {
    if (searchTerm === undefined || searchTerm === 0) {
      return true; // Display all units
    }
    return u.workerOrderLatestNumber === searchTerm;
  });

  const currentRequest = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const onUpdate = (MaintenanceRequest: IMaintenanceRequest) => {
    store.maintenance.maintenance_request.select(MaintenanceRequest);
    showModalFromId(DIALOG_NAMES.MAINTENANCE.VIEW_WORK_ORDER_SP); //create update dialog
  };
  return (
    <div className="uk-section leave-analytics-page sales-order owner-cards">
      {me?.role === "Service Provider" ? (
        <>
          <div className="uk-container uk-container-large">
            <div className="section-toolbar uk-margin">
              <h4 className="section-heading uk-heading">Quote Requests</h4>
              <div className="controls">
                <div className="uk-inline"></div>
              </div>
            </div>
            <div className="uk-margin">
              <div className="uk-margin">Search Requests</div>
              <div className="uk-margin">
                <input
                  className="uk-input"
                  placeholder="Search for a Request number"
                  style={{ width: "60%" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(Number(e.target.value))}
                />
              </div>
            </div>
            <Grid container spacing={2}>
              {currentRequest.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {" "}
                        {/**Request */} {card.description}
                        <button
                          className="uk-button default"
                          onClick={()=> viewWorkOrderFlow(card)}
                        >
                          View Work Order
                        </button>
                      </Typography>
                      <Typography variant="h5" component="div">
                        <span style={{ textTransform: "capitalize" }}>
                          {/* {getUnitsRequestOwner(users, units, card.id)} */}
                        </span>
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {/* {card.adjective} */}
                      </Typography>
                      {/* <Typography variant="body2">{card.description}</Typography> */}
                    </CardContent>
                    <CardActions>
                      {/* <Button size="small">Learn More</Button> */}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <NoRequests />
      )}
        <Modal modalId={DIALOG_NAMES.MAINTENANCE.VIEW_WORK_ORDER_SP}>
        <SPWorkOrderFlowDialog />
      </Modal>
    </div>
  );
});
//! add back to filter out the requests
// && canViewMaintenanceRequestDetails(me?.uid || "", maintenanceRequests)
