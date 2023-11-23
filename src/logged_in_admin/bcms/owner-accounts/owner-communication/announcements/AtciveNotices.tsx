import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Grid, Paper, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAppContext } from "../../../../../shared/functions/Context";
import { IAnnouncements } from "../../../../../shared/models/communication/announcements/AnnouncementModel";
import "./NoticesCards.scss";
import Pagination from "../../../../shared/PaginationComponent";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export const AtciveNotices = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const currentDate = new Date();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const announcements = store.communication.announcements.all
    .map((a) => {
      return a.asJson;
    })
    .sort(
      (a, b) =>
        new Date(b.dateAndTime).getTime() - new Date(a.dateAndTime).getTime()
    );

  const filteredAnnouncements = announcements
    .sort(
      (a, b) =>
        new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
    )
    .filter((announcement) => new Date(announcement.expiryDate) >= currentDate)
    .map((a) => {
      return a;
    });

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year) {
        await api.communication.announcement.getAll(me.property, me.year);
      }
    };
    getData();
  }, [api.communication.announcement, me?.property, me?.year]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Adjust as needed

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const lowercaseSearchTerm = searchTerm.toLowerCase();

  const filteredNotices = filteredAnnouncements.filter((announcesments) =>
    announcesments.title.toLowerCase().includes(lowercaseSearchTerm)
  );

  const currentAnnouncements = filteredNotices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="notices-cards card active-card">
      <div className="uk-margin">
        <div className="uk-margin">Search Notices</div>
        <div className="uk-margin">
          <input
            className="uk-input"
            placeholder="Search for a Notice"
            style={{ width: "60%" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Grid container spacing={2}>
        {currentAnnouncements.map((card, index) => (
          <AnnouncementCard key={index} card={card} />
        ))}
      </Grid>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
});

interface AnnouncementCardProps {
  card: IAnnouncements;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ card }) => {
  return (
    <Grid item xs={12} sm={6} md={4} className="cardContainer">
      <Card className={`card ${card.priorityLevel}`}>
        <CardContent className="cardContent">
          <Typography variant="h6" gutterBottom className="title">
            {card.title}
          </Typography>
          <Typography variant="h5" component="div" className="message">
            {card.message}
          </Typography>
          <Typography className={`priority ${card.priorityLevel}`}>
            {card.priorityLevel}
          </Typography>
          <Typography variant="body2" className="date">
            {card.dateAndTime}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
