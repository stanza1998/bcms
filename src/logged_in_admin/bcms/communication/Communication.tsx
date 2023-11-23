import CampaignIcon from "@mui/icons-material/Campaign";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnnouncementGraph } from "./graphs/Announcements";
import AnnouncementGrid from "./announcements/grid/AnnouncementGrid";
import ExpiredAnnouncementGrid from "./ExpiredAnnouncement";
import DIALOG_NAMES from "../../dialogs/Dialogs";
import { AnnouncementDialog } from "../../dialogs/communication-dialogs/announcements/AnnouncementDialog";
import { ViewAnnouncementDialog } from "../../dialogs/communication-dialogs/announcements/ViewAnnouncementDialog";
import Modal from "../../../shared/components/Modal";
import { Grid } from "@mui/material";

export const Communication = observer(() => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();
  const me = store.user.meJson;
  const currentDate = Date.now();
  const announcements = store.communication.announcements.all;
  const customContacts = store.communication.customContacts.all;

  const ownersContact = store.user.all.filter((u) => u.asJson.role === "Owner");
  const suppliers = store.bodyCorperate.supplier.all;

  const activeAnnouncements = announcements.filter((announcement) => {
    const expiryDate = new Date(announcement.asJson.expiryDate).getTime();
    return expiryDate > currentDate;
  });
  const expiredAnnouncements = announcements.filter((announcement) => {
    const expiryDate = new Date(announcement.asJson.expiryDate).getTime();
    return expiryDate < currentDate;
  });

  const totalAnnouments = announcements.length;
  const totalActiveAnnouncements = activeAnnouncements.length;
  const totalExpiredAnnouncements = expiredAnnouncements.length;
  const totalContact =
    suppliers.length + ownersContact.length + customContacts.length;

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year) {
        await api.communication.announcement.getAll(me.property, me.year);
        await api.communication.customContact.getAll(me.property);
        await api.auth.loadAll();
        await api.body.supplier.getAll(me.property);
      }
    };
    getData();
  }, [
    api.auth,
    api.body.supplier,
    api.communication.announcement,
    api.communication.customContact,
    api.communication.privateMessage,
    me?.property,
    me?.year,
  ]);

  const toAnnouncements = () => {
    // navigate("/c/communication/notices");
  };
  const toContactManagement = () => {
    // navigate("/c/communication/contact-management");
  };

  const _announcements = store.communication.announcements.all.map((a) => {
    return a.asJson;
  });

  const filteredAnnouncements = _announcements.sort(
    (a, b) =>
      new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
  );

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year) {
        await api.communication.announcement.getAll(me.property, me.year);
      }
    };
    getData();
  }, []);

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div
          className="uk-child-width-1-2@m uk-grid-small uk-grid-match"
          data-uk-grid
        >
          <div onClick={toAnnouncements}>
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
                Total Notices
              </h3>
              <p className="number">{totalAnnouments}</p>
            </div>
          </div>
          <div onClick={toAnnouncements}>
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
                Active Notices
              </h3>
              <p className="number">{totalActiveAnnouncements}</p>
            </div>
          </div>
          <div onClick={toAnnouncements}>
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
                Expired Notices
              </h3>
              <p className="number">{totalExpiredAnnouncements}</p>
            </div>
          </div>
          {me?.role !== "Owner" && (
            <div onClick={toContactManagement}>
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
                  Total Contacts
                </h3>
                <p className="number"> {totalContact}</p>
              </div>
            </div>
          )}
        </div>
        <div className="uk-margin">
          {me?.role !== "Owner" && (
            <Grid container spacing={2}>
              {/* First Grid Item */}
              <Grid item xs={12} md={6}>
                <div style={{ height: "100%" }}>
                  {/* Conditionally render based on screen size */}
                  <AnnouncementGraph />
                </div>
              </Grid>

              {/* Second Grid Item */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  {/* Nested Grid Item */}
                  <Grid item xs={12}>
                    <ExpiredAnnouncementGrid data={filteredAnnouncements} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </div>
      </div>
      <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG}>
        <AnnouncementDialog />
      </Modal>
      <Modal modalId={DIALOG_NAMES.COMMUNICATION.VIEW_ANNOUNCEMENT_DIALOG}>
        <ViewAnnouncementDialog />
      </Modal>
    </div>
  );
});
