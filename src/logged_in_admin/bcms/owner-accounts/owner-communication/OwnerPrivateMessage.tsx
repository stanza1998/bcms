import { useEffect, useRef, useState } from "react";
import "./OwnerPrivateMessage.scss";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { IPrivateMessage } from "../../../../shared/models/communication/private-message/PrivateMessage";
import { FailedAction } from "../../../../shared/models/Snackbar";

export const OwnerPrivateMessage = observer(() => {
  const { api, store, ui } = useAppContext();
  const me = store.user.meJson;
  const currentDate = Date.now();
  const [receiver, setReceiver] = useState("");
  // const owners = store.user.all
  // .filter((u) => u.asJson.role === "Owner")
  // .map((u) => {
  //   return u.asJson;
  // });

  const allUsers = store.user.all;

  const [messages, setMessages] = useState<IPrivateMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");

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

  const sendMessage = async () => {
    if (messageInput.trim() === "") {
      return FailedAction(ui);
    }
    const message: IPrivateMessage = {
      id: "",
      receiver: me?.uid || "",
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
      getData();
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

  //behavoiur
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   // Scroll to the bottom of the chat messages after component has mounted
  //   if (chatMessagesRef.current) {
  //     chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  //   }
  // }, []);

  useEffect(() => {
    if (chatMessagesRef.current) {
      const chatMessagesContainer = chatMessagesRef.current;
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  }, []);

  return (
    <div
      className="uk-section leave-analytics-page private-message"
      style={{ textAlign: "center" }}
    >
      <div className="uk-container large uk-flex-column">
        <div className="section-toolbar uk-margin uk-flex align-center ">
          <div>
            <h4 className="section-heading uk-heading">Private Message</h4>
          </div>
          <div className="controls">
            <div className="uk-inline"></div>
          </div>
        </div>
        <div className="chat-container uk-align-center">
          <div
            className="chat-messages"
            id="chat-messages"
            ref={chatMessagesRef}
          >
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
              .filter((m) => m.receiver === me?.uid)
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
                  <span uk-icon="icon: user; ratio:1"></span>
                  <span
                    style={{
                      fontSize: "11px",
                      textTransform: "capitalize",
                      padding: "20px",
                    }}
                  >
                    {allUsers
                      .filter((u) => u.asJson.uid === message.sender)
                      .map((u) => {
                        return u.asJson.firstName + " " + u.asJson.lastName;
                      })}
                  </span>
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
              className="uk-input uk-width-1-1"
              type="text"
              id="message-input"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button
              // style={{ background: receiver === "" ? "grey" : "" }}
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
