// MyComponent.jsx
import React, { useEffect, useState } from "react";
import "./OwnerCard.scss";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import { nadFormatter } from "../../../shared/NADFormatter";
import { Grid, Paper, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { getUnitsRequestOwner } from "../../../shared/common";
import Pagination from "../../../shared/PaginationComponent";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export const OwnerAccount = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const [searchTerm, setSearchTerm] = useState<number>();

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

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      if (me?.property) {
        await api.unit.getAll(me?.property);
      }
    };
    getData();
  }, [api.body.body, api.unit, me?.property]);

  const onView = () => {
    showModalFromId(DIALOG_NAMES.BODY.OWNER_UNIT_VIEW);
  };

  const units = store.bodyCorperate.unit.all
    .filter((u) => u.asJson.ownerId === me?.uid)
    .map((u) => u.asJson);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3; // Adjust as needed

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(units.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const lowercaseSearchTerm = searchTerm;

  const filteredUnits = units.filter((u) => {
    if (searchTerm === undefined || searchTerm === 0) {
      return true; // Display all units
    }

    // Assuming u.unitName is a number
    return u.unitName === searchTerm;
  });

  const currentUnit = filteredUnits.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="uk-section leave-analytics-page sales-order owner-cards">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">My Units</h4>
          <div className="controls">
            <div className="uk-inline">
              {/* <button
                // onClick={onCreate}
                className="uk-button primary"
                type="button"
              >
                Add Supplier
              </button> */}
            </div>
          </div>
        </div>
        <div className="uk-margin">
          <div className="uk-margin">Search Units</div>
          <div className="uk-margin">
            <input
              className="uk-input"
              placeholder="Search for a unit number"
              style={{ width: "60%" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(Number(e.target.value))}
            />
          </div>
        </div>
        <Grid container spacing={2}>
          {currentUnit.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    UNIT {card.unitName}
                  </Typography>
                  <Typography variant="h5" component="div">
                    <span style={{ textTransform: "capitalize" }}>
                      {getUnitsRequestOwner(users, units, card.id)}
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
    </div>
  );
});
