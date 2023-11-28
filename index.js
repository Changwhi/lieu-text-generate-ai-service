import express from "express";
import cors from "cors";
import pkg from "express-ipfilter";
import TextGeneratorPipeline from "./models/TextGeneratorPipeline.js";
import { errorHandler } from "./error.handler.js";
const { IpFilter } = pkg;

const port = process.env.PORT || 3000;
const app = express();

const validateRequest = (req, res, next) => {
  if (!req.body.text) {
    return res.status(400).send({ error: "No text provided" });
  }
  next();
};

app.use(IpFilter([process.env.WHITELIST_IP], { mode: "allow" }));

app.use(express.json());
app.use(
  cors({
    methods: "POST, GET",
  }),
);

app.post("/generate", validateRequest, async (req, res) => {
  try {
    const text = req.body.text;
    const pipeline = await TextGeneratorPipeline.getInstance();
    const out = await pipeline(text, {
      add_special_tokens: true,
      max_new_tokens: 60,
      repetition_penalty: 1.2,
    });

    res.json({ result_text: out[0].generated_text });
    return;
  } catch (error) {
    console.error("Error in textGenerator route", error);
    return res.status(500).send({ error: error });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log("Listening on PORT:", port);
});
