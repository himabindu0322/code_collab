import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import Chat from "../components/Chat";

const Editor = () => {
  const [room, setRoom] = useState("");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  // LANGUAGE STATE
  const [language, setLanguage] = useState(63);

  // DARK MODE STATE
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    socket.on("receive_code", (data) => {
      setCode(data);
    });

    return () => {
      socket.off("receive_code");
    };
  }, []);

  // JOIN ROOM
  const joinRoom = () => {
    console.log("Joining Room:", room);

    socket.emit("join_room", room);

    alert("Joined Room: " + room);
  };

  // HANDLE CODE CHANGE
  const handleCodeChange = (e) => {
    const newCode = e.target.value;

    setCode(newCode);

    socket.emit("send_code", {
      room,
      code: newCode,
    });
  };

  // RUN CODE
  const runCode = async () => {
    try {
      const response = await fetch(
        "http://localhost:5005/api/code/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language_id: language,
          }),
        }
      );

      const data = await response.json();

      setOutput(data.stdout || data.stderr || "No Output");
    } catch (error) {
      console.log(error);
      setOutput("Error running code");
    }
  };

  // SAVE CODE
  const saveCode = async () => {
    try {
      const response = await fetch(
        "http://localhost:5005/api/savecode/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: room,
            code,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        background: darkMode
          ? "#121212"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6B8DD6 100%)",
      }}
    >
      <div
        style={{
          ...styles.card,
          backgroundColor: darkMode ? "#1e1e1e" : "white",
          color: darkMode ? "white" : "black",
        }}
      >
        <h1 style={styles.heading}>🚀 CodeCollab</h1>

        <p style={styles.subHeading}>
          Real-Time Collaborative Coding Platform
        </p>

        {/* THEME BUTTON */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={styles.themeButton}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <br />
        <br />

        {/* ROOM SECTION */}
        <div style={styles.roomSection}>
          <input
            type="text"
            placeholder="Enter Room ID"
            onChange={(e) => setRoom(e.target.value)}
            style={styles.input}
          />

          <button onClick={joinRoom} style={styles.button}>
            Join Room
          </button>
        </div>

        {/* LANGUAGE SELECT */}
        <select
          value={language}
          onChange={(e) => setLanguage(Number(e.target.value))}
          style={styles.select}
        >
          <option value={50}>C</option>
          <option value={54}>C++</option>
          <option value={62}>Java</option>
          <option value={71}>Python</option>
          <option value={63}>JavaScript</option>
        </select>

        <br />
        <br />

        {/* BUTTONS */}
        <div style={styles.buttonSection}>
          <button onClick={runCode} style={styles.runButton}>
            ▶ Run Code
          </button>

          <button onClick={saveCode} style={styles.saveButton}>
            💾 Save Code
          </button>
        </div>

        <br />

        {/* CODE AREA */}
        <textarea
          rows="20"
          value={code}
          onChange={handleCodeChange}
          style={{
            ...styles.textarea,
            backgroundColor: darkMode ? "#2d2d2d" : "#f8f9ff",
            color: darkMode ? "white" : "black",
          }}
          placeholder="Start coding here..."
        />

        {/* OUTPUT BOX */}
        <div style={styles.outputBox}>
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>

        {/* LIVE CHAT */}
        <Chat room={room} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    width: "90%",
    maxWidth: "900px",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  heading: {
    textAlign: "center",
    color: "#4B0082",
    fontSize: "40px",
    marginBottom: "10px",
  },

  subHeading: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
    fontSize: "18px",
  },

  themeButton: {
    backgroundColor: "#222",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },

  roomSection: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "2px solid #667eea",
    fontSize: "16px",
    outline: "none",
  },

  button: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  buttonSection: {
    display: "flex",
    gap: "10px",
  },

  runButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  saveButton: {
    backgroundColor: "#ff9800",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "2px solid #764ba2",
    fontSize: "16px",
    width: "200px",
  },

  textarea: {
    width: "100%",
    height: "450px",
    borderRadius: "15px",
    border: "2px solid #764ba2",
    padding: "15px",
    fontSize: "16px",
    fontFamily: "monospace",
    resize: "none",
    outline: "none",
  },

  outputBox: {
    marginTop: "20px",
    background: "#111",
    color: "#0f0",
    padding: "15px",
    borderRadius: "10px",
    minHeight: "120px",
  },
};

export default Editor;
