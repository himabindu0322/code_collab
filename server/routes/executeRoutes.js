const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const { code, language_id } = req.body;

    const response = await axios.post(
      "https://ce.judge0.com/submissions?wait=true",
      {
        source_code: code,
        language_id: language_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      message: "Code execution failed",
    });
  }
});

module.exports = router;
