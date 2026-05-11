import React, { useRef, useState } from "react";
import { socket } from "../socket";

const VideoCall = () => {
  const [roomId, setRoomId] = useState("");

  const localVideoRef = useRef();

  // JOIN ROOM
  const joinRoom = async () => {
    if (!roomId) {
      alert("Enter Room ID");
      return;
    }

    // JOIN SOCKET ROOM
    socket.emit("join-video-room", roomId);

    alert("Joined Video Room: " + roomId);

    // START CAMERA
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = stream;
    } catch (error) {
      console.log(error);

      alert("Camera/Mic permission denied");
    }
  };

  // START CALL
  const startCall = () => {
    alert("Video Call Started");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>📹 Video Call</h1>

        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={styles.input}
        />

        <div style={styles.buttonSection}>
          <button onClick={joinRoom} style={styles.joinButton}>
            Join Room
          </button>

          <button onClick={startCall} style={styles.callButton}>
            Start Call
          </button>
        </div>

        <div style={styles.videoContainer}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={styles.video}
          />
        </div>
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
    background:
      "linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    width: "700px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  heading: {
    marginBottom: "20px",
    color: "#1f4037",
  },

  input: {
    width: "80%",
    padding: "12px",
    borderRadius: "10px",
    border: "2px solid #1f4037",
    marginBottom: "20px",
    fontSize: "16px",
  },

  buttonSection: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  joinButton: {
    padding: "12px 20px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  callButton: {
    padding: "12px 20px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  videoContainer: {
    marginTop: "20px",
  },

  video: {
    width: "100%",
    borderRadius: "15px",
    background: "black",
  },
};

export default VideoCall;
