import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { Grid, Paper, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { IMaintenanceRequest } from "../../../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";
import "../owner-communication/announcements/NoticesCards.scss";
import Modal from "../../../../shared/components/Modal";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import { OwnerRequestDialog } from "../../../dialogs/maintenance/maintenance-request/OwnerRequestDialog";
import showModalFromId from "../../../../shared/functions/ModalShow";
import { getUnitName } from "../../../shared/common";
import { IUnit } from "../../../../shared/models/bcms/Units";
import Pagination from "../../../shared/PaginationComponent";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export const OwnerRequest = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const [searchTerm, setSearchTerm] = useState<string>("");

  const myRequest = store.maintenance.maintenance_request.all
  .sort((a, b) => new Date(b.asJson.dateRequested).getTime() - new Date(a.asJson.dateRequested).getTime())
    .filter((req) => req.asJson.ownerId === me?.uid)
    .map((req) => {
      return req.asJson;
    });
  const myUnits = store.bodyCorperate.unit.all
    .filter((req) => req.asJson.ownerId === me?.uid)
    .map((req) => {
      return req.asJson;
    });

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.OWNER.CREATE_REQUEST);
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.maintenance.maintenance_request.getAll(me.property);
      }
    };
    getData();
  }, [api.maintenance.maintenance_request, me?.property]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Adjust as needed

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(myRequest.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const lowercaseSearchTerm = searchTerm.toLowerCase();

  const filteredRequest = myRequest.filter((req) =>
    req.description.toLowerCase().includes(lowercaseSearchTerm)
  );

  const currentRequest = filteredRequest.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Maintenance Request</h4>
          <div className="controls">
            <div className="uk-inline">
              <button
                onClick={onCreate}
                className="uk-button primary"
                type="button"
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
        {/* <div className="uk-margin">
          <div className="uk-margin">Search Requests</div>
          <div className="uk-margin">
            <input
              className="uk-input"
              placeholder="Search for a Request"
              style={{ width: "60%" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div> */}
        <div className="notices-cards card active-card">
          <Grid container spacing={2}>
            {currentRequest.map((card, index:number) => (
              <RequestCard key={index} card={card} units={myUnits} />
            ))}
          </Grid>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Modal modalId={DIALOG_NAMES.OWNER.CREATE_REQUEST}>
        <OwnerRequestDialog />
      </Modal>
    </div>
  );
});

interface RequestCardProps {
  card: IMaintenanceRequest;
  units: IUnit[];
}

const RequestCard: React.FC<RequestCardProps> = observer(({ card, units }) => {
  return (
    <Grid item xs={12} sm={6} md={4} className="cardContainer">
      <Card className={`card ${card.status}`}>
        <CardContent className="cardContent">
          <Typography variant="h6" gutterBottom className="title">
            {getUnitName(units, card.unitId)}
          </Typography>
          <Typography variant="h5" component="div" className="message">
            {card.description}
          </Typography>
          <Typography className={`status ${card.status}`}>
            {card.status}
          </Typography>
          <Typography variant="body2" className="date">
            {card.dateRequested}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
});
