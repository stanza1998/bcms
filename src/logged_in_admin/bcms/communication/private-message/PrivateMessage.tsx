import { useState } from "react";
import "./PrivateMessage.scss";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";

export const PrivateMessage = observer(() => {
  const { api, store } = useAppContext();
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");

  const sendMessage = () => {
    if (messageInput.trim() === "") {
      return;
    }
    setMessages([...messages, messageInput]);
    setMessageInput("");
  };
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
          <select style={{ width: "30%" }} className="uk-input">
            <option>Select Owner</option>
          </select>
        </div>
        <div className="chat-container">
          <div className="chat-messages" id="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className="message">
                {message}
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
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
});
