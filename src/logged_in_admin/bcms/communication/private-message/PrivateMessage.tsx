import { useEffect, useRef, useState } from "react";
import "./PrivateMessage.scss";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { FailedAction } from "../../../../shared/models/Snackbar";
import { IPrivateMessage } from "../../../../shared/models/communication/private-message/PrivateMessage";
import SingleSelect from "../../../../shared/components/single-select/SlingleSelect";
import Toolbar2 from "../../../shared/Toolbar2";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../../shared/database/FirebaseConfig";
import { MessageLoader } from "../../../../shared/functions/messageLoader/MessageLoader";

export const PrivateMessage = observer(() => {
  const { api, store, ui } = useAppContext();
  const me = store.user.meJson;
  const currentDate = Date.now();
  const [receiver, setReceiver] = useState("");
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const [messageLoader, setMessageLoader] = useState<boolean>(false);

  const owners = store.user.all
    .filter((u) => u.asJson.role === "Owner")
    .map((u) => {
      return {
        value: u.asJson.uid,
        label: u.asJson.firstName + " " + u.asJson.lastName,
      };
    });

  const handleSelectChange = (selectedValue: string) => {
    setReceiver(selectedValue);
    getData(selectedValue);
  };

  const getData = (receiver: string) => {
    if (receiver !== "") {
      setMessageLoader(true);
      const myPath = `BodyCoperate/${me?.property}/PrivateMessages/${receiver}/`;
      const messageRef = collection(db, myPath, "UserMessages");
      const unsubscribe = onSnapshot(messageRef, (querySnapshot) => {
        const updatedMessages = querySnapshot.docs.map((doc) =>
          doc.data()
        ) as IPrivateMessage[];
        setMessages(updatedMessages);
      });
      setMessageLoader(false);
      return () => unsubscribe();
    } else {
      console.log("owner not selected");
      setMessageLoader(false);
    }
  };

  const allUsers = store.user.all;

  const [messages, setMessages] = useState<IPrivateMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");

  const sendMessage = async (e: any) => {
    e.preventDefault();
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
        await api.communication.privateMessage.create(
          message,
          me.property,
          receiver
        );
    } catch (error) {
      console.log(error);
    } finally {
      setMessageInput("");
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.auth.loadAll();
      }
    };
    getData();
  }, []);

  //behavoiur

  useEffect(() => {
    // Scroll to the bottom of the chat container
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, handleSelectChange]);

  return (
    <div
      className="uk-section leave-analytics-page private-message"
      style={{ textAlign: "center" }}
    >
      <div className="uk-container large uk-flex-column">
        <Toolbar2
          rightControls={
            <div style={{ width: "100%" }}>
              <SingleSelect
                options={owners}
                onChange={handleSelectChange}
                value={receiver}
              />
            </div>
          }
        />
        <div className="chat-container uk-align-center">
          {messageLoader ? (
            <MessageLoader />
          ) : (
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
                .filter((m) => m.receiver === receiver)
                .map((message, index) => (
                  <div
                    key={index}
                    className="message"
                    style={{
                      textAlign: me?.uid === message.sender ? "right" : "left",
                      marginLeft: me?.uid === message.sender ? "auto" : "",
                      maxWidth: me?.uid === message.sender ? "90%" : "90%",
                      backgroundColor:
                        me?.uid === message.sender ? "#01aced" : "#1c4dff",
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
                          return u.asJson.uid === me?.uid
                            ? "ME"
                            : u.asJson.firstName + " " + u.asJson.lastName;
                        })}
                    </span>
                    <p style={{ marginBottom: "5px" }}>
                      {message.dateAndTime &&
                      Date.now() - new Date(message.dateAndTime).getTime() >=
                        5000
                        ? new Date(message.dateAndTime).toLocaleString()
                        : "Now"}
                    </p>
                    <p style={{ margin: "0" }}>{message.message}</p>
                  </div>
                ))}
            </div>
          )}

          <form className="chat-input" onSubmit={sendMessage}>
            <input
              className="uk-input uk-width-1-1"
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
              type="submit"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

// const getData = async () => {
//   if (me?.property) {
//     await api.communication.privateMessage.getAll(me.property);
//     await api.auth.loadAll();
//   }
//   const messages = store.communication.privateMessage.all.map((m) => {
//     return m.asJson;
//   });
//   setMessages(messages);
// };

// useEffect(() => {
//   const getData = async () => {
//     if (me?.property) {
//       await api.communication.privateMessage.getAll(me.property);
//       await api.auth.loadAll();
//     }
//     const messages = store.communication.privateMessage.all.map((m) => {
//       return m.asJson;
//     });
//     setMessages(messages);
//   };
//   getData();
// }, []);
