import express from "express";
import {
  youtubeDownload,
  facebookDownload,
  instagramDownload,
} from "./downloaders/index.js";
import ApiError from "./utils/apiError.js";
import ApiResponse from "./utils/apiResponse.js";
import cors from "cors";
import { configDotenv } from "dotenv";

const port = process.env.PORT || 8000;

const app = express();

configDotenv({
  path: ".env",
});
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/v1/videoDetails", async (req, res) => {
  const url = req.query.url;

  try {
    const method = getMethod(url);

    if (!method) {
      throw new ApiError(400, "Invalid URL");
    }

    const data = await method(url);
    if (data) {
      res.json(
        new ApiResponse(200, "Video details fetched successfully", data)
      );
    } else throw new ApiError(400, "Invalid URL");
  } catch (error) {
    console.log(error);

    res
      .status(error.status || 500)
      .json(error || new ApiError(500, "Internal server Error"));
  }
});

function getMethod(url) {
  const { hostname } = new URL(url);

  if (hostname.includes("youtube") || hostname.includes("youtu.be")) {
    return youtubeDownload;
  } else if (hostname.includes("facebook")) {
    return facebookDownload;
  } else if (hostname.includes("instagram")) {
    return instagramDownload;
  } else {
    return null;
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
