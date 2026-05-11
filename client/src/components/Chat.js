import React, { useEffect, useState } from "react";
import { socket } from "../socket";

const Chat = ({ room }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      room,
      message,
    };

    socket.emit("send_message", messageData);

    setMessages((prev) => [...prev, messageData]);

    setMessage("");
  };

  return (
    <div style={styles.chatContainer}>
      <h2>💬 Live Chat</h2>

      <div style={styles.messagesBox}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            {msg.message}
          </div>
        ))}
      </div>

      <div style={styles.inputSection}>
        <input
          type="text"
          placeholder="Enter message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />

        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    marginTop: "20px",
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },

  messagesBox: {
    height: "200px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "10px",
    background: "#f8f8f8",
  },

  message: {
    background: "#667eea",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  inputSection: {
    display: "flex",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid gray",
  },

  button: {
    background: "#28a745",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default Chat;
