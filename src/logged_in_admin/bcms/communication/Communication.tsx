import CampaignIcon from "@mui/icons-material/Campaign";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import ForumIcon from "@mui/icons-material/Forum";
import MessageIcon from "@mui/icons-material/Message";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import { useEffect } from "react";

export const Communication = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const currentDate = Date.now();

  const currentDate1 = new Date(); // Get current date and time
  const currentDay = currentDate1.getDate(); // Get current day

  const announcements = store.communication.announcements.all;
  const messages = store.communication.privateMessage.all;
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
  const totalMessages = messages.length;
  const totalTodayMessages = messages.filter((message) => {
    if (message.asJson.dateAndTime) {
      const messageDate = new Date(message.asJson.dateAndTime);
      const messageDay = messageDate.getDate();

      return messageDay === currentDay;
    }
    return false; // If dateAndTime is not available, filter it out
  });

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year) {
        await api.communication.announcement.getAll(me.property, me.year);
        // await api.communication.privateMessage.getAll(me.property);
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

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div
          className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
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
                Total Announcement
              </h3>
              <p>{totalAnnouments}</p>
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
                Active Announcement
              </h3>
              <p>{totalActiveAnnouncements}</p>
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
                Expired Announcements
              </h3>
              <p>{totalExpiredAnnouncements}</p>
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
                Total Contacts
              </h3>
              <p> {totalContact}</p>
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
                Total Messages
              </h3>
              <p>{totalMessages}</p>
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
                Today's Messages
              </h3>
              <p> {totalTodayMessages.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
