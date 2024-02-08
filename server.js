const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

// const OpenAI = require("openai");
// OpenAI.ApiKey = "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";
// const openaiObj = new OpenAI({
//   ApiKey: "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",
// });

const OpenAI = require("openai");

const openai = new OpenAI(
  "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"
);

async function main() {
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: "A cute baby sea otter",
  });

  console.log(image.data);
}

app.post("/images", async (req, res) => {
  try {
    const image = await openaiObj.images.generate({
      model: "dall-e-3",
      prompt: "A cute baby sea otter",
    });
    console.log(image.data);
    res.send(image.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log("Your server is running on port" + PORT));
