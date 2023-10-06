import { useEffect, useState } from "react";
import "./PrivateMessage.scss";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { FailedAction } from "../../../../shared/models/Snackbar";
import { IPrivateMessage } from "../../../../shared/models/communication/private-message/PrivateMessage";

export const PrivateMessage = observer(() => {
  const { api, store, ui } = useAppContext();
  const me = store.user.meJson;
  const currentDate = Date.now();
  const [receiver, setReceiver] = useState("");
  const owners = store.user.all
    .filter((u) => u.asJson.role === "Owner")
    .map((u) => {
      return u.asJson;
    });

  const [messages, setMessages] = useState<IPrivateMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");

  const sendMessage = async () => {
    if (messageInput.trim() === "") {
      return FailedAction(ui);
    }
    const message: IPrivateMessage = {
      id: "",
      receiver: receiver,
      sender: me?.uid || "",
      message: messageInput,
      dateAndTime: currentDate || null,
    };
    try {
      if (me?.property)
        await api.communication.privateMessage.create(message, me.property);
    } catch (error) {
      console.log(error);
    } finally {
      setMessageInput("");
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.communication.privateMessage.getAll(me.property);
        await api.auth.loadAll();
      }

      const messages = store.communication.privateMessage.all.map((m) => {
        return m.asJson;
      });
      setMessages(messages);
    };
    getData();
  }, []);

  return (
    <div className="uk-section leave-analytics-page private-message">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Private Message</h4>
          <div className="controls">
            <div className="uk-inline"></div>
          </div>
        </div>
        <div>
          <label>Message Owner</label>
          <br />
          <select
            style={{ width: "30%" }}
            className="uk-input"
            onChange={(e) => setReceiver(e.target.value)}
          >
            <option value="">Select Owner</option>
            {owners.map((owner) => (
              <option value={owner.uid}>
                {owner.firstName + " " + owner.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="chat-container">
          <div className="chat-messages" id="chat-messages">
            {messages
              .sort((a, b) => {
                const nullValue = Number.MAX_SAFE_INTEGER;
                const dateA = a.dateAndTime
                  ? new Date(a.dateAndTime).getTime()
                  : nullValue;
                const dateB = b.dateAndTime
                  ? new Date(b.dateAndTime).getTime()
                  : nullValue;
                return dateA - dateB;
              })
              .filter((m) => m.receiver === receiver)
              .map((message, index) => (
                <div
                  key={index}
                  className="message"
                  style={{
                    textAlign: me?.uid === message.sender ? "right" : "left",
                    marginLeft: me?.uid === message.sender ? "auto" : "",
                    maxWidth: me?.uid === message.sender ? "60%" : "60%",
                    backgroundColor:
                      me?.uid === message.sender ? "#01aced" : "#4caf50",
                    color: "#fff",
                    borderRadius: "5px",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <p style={{ marginBottom: "5px" }}>
                    {message.dateAndTime
                      ? new Date(message.dateAndTime).toLocaleString()
                      : "No date available"}
                  </p>
                  <p style={{ margin: "0" }}>{message.message}</p>
                </div>
              ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              id="message-input"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button
              style={{ background: receiver === "" ? "grey" : "" }}
              disabled={receiver === ""}
              className="uk-button primary"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
