const express = require("express");
const Code = require("../models/Code");

const router = express.Router();

// SAVE CODE
router.post("/save", async (req, res) => {
  try {
    const { roomId, code } = req.body;

    const existingRoom = await Code.findOne({ roomId });

    if (existingRoom) {
      existingRoom.code = code;

      await existingRoom.save();

      return res.json({
        message: "Code Updated",
      });
    }

    const newCode = new Code({
      roomId,
      code,
    });

    await newCode.save();
    res.json({
      message: "Code Saved",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error saving code",
    });
  }
});

// GET CODE
router.get("/:roomId", async (req, res) => {
  try {
    const room = await Code.findOne({
      roomId: req.params.roomId,
    });

    if (!room) {
      return res.json({
        code: "",
      });
    }
    res.json(room);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching code",
    });
  }
});

module.exports = router;


