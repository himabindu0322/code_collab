import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Editor from "./pages/Editor";
import VideoCall from "./pages/VideoCall";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* SIGNUP PAGE */}
        <Route path="/" element={<Signup />} />

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* CODE EDITOR */}
        <Route path="/editor" element={<Editor />} />

        {/* VIDEO CALL PAGE */}
        <Route path="/video" element={<VideoCall />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
