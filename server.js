const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());
app.use(express.json());

const endpoint = "https://api.openai.com/v1/images/generations";
const apiKey = process.env.OPENAI_API_KEY;
const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");

app.post("/images", async (req, res) => {
  console.log("Received Request Body:", req.body);
  try {
    const requestData = {
      model: "dall-e-2",
      prompt: String(req.body.message),
      n: 3,
      size: "1024x1024",
    };
    console.log("Received Message:", req.body.message);
    const response = await axios.post(endpoint, requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    console.log("Raw Response:", response.data.data);
    res.json(response.data.data);
  } catch (error) {
    if (error.response) {
      console.error("OpenAI API Error:", error.response.data);
      return res.status(500).json(error.response.data);
    } else {
      console.error("Network error:", error.message);
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log(req.file);
    return res.status(200).json({ message: "File uploaded successfully" });
  });
});

app.listen(PORT, () => console.log("Your server is running on port " + PORT));
