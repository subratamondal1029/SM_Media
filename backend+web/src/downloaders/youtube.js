import { savefrom } from "@bochilteam/scraper-savefrom";
import ApiError from "../utils/apiError.js";

export default async function youtubeDownload(url) {
  try {
    const response = await savefrom(url);

    const refiendedResponse = {
      title: response[0].meta.title,
      thumb: response[0].thumb,
      duration: response[0].meta.duration,
      source: response[0].meta.source,
      qualities: response[0]?.url.map((urlObj) => ({
        url: urlObj?.url,
        type: urlObj?.name,
        mute: urlObj?.type?.includes("dash") ? true : false,
        quality: getQuality(urlObj.url),
      })),
    };

    return refiendedResponse;
  } catch (error) {
    throw new ApiError(
      error.status || 500,
      error.message || "Something Went Wrong during youtube Data Fetching!"
    );
  }
}

function getQuality(url, type) {
  const qualities = [
    { itag: 5, quality: 240 },
    { itag: 6, quality: 270 },
    { itag: 13, quality: 144 },
    { itag: 17, quality: 144 },
    { itag: 18, quality: 360 },
    { itag: 22, quality: 720 },
    { itag: 34, quality: 360 },
    { itag: 35, quality: 480 },
    { itag: 36, quality: 240 },
    { itag: 37, quality: 1080 },
    { itag: 38, quality: 3072 },
    { itag: 43, quality: 360 },
    { itag: 44, quality: 480 },
    { itag: 45, quality: 720 },
    { itag: 46, quality: 1080 },
    { itag: 82, quality: 360 },
    { itag: 83, quality: 480 },
    { itag: 84, quality: 720 },
    { itag: 85, quality: 1080 },
    { itag: 92, quality: 240 },
    { itag: 93, quality: 360 },
    { itag: 94, quality: 480 },
    { itag: 95, quality: 720 },
    { itag: 96, quality: 1080 },
    { itag: 133, quality: 240 },
    { itag: 134, quality: 360 },
    { itag: 135, quality: 480 },
    { itag: 136, quality: 720 },
    { itag: 137, quality: 1080 },
    { itag: 138, quality: 2160 },
    { itag: 160, quality: 144 },
    { itag: 264, quality: 1440 },
    { itag: 266, quality: 2160 },
    { itag: 298, quality: 720 },
    { itag: 299, quality: 1080 },
    { itag: 302, quality: 720 },
    { itag: 303, quality: 1080 },
    { itag: 308, quality: 1440 },
    { itag: 315, quality: 2160 },
    { itag: 330, quality: 144 },
    { itag: 331, quality: 240 },
    { itag: 332, quality: 360 },
    { itag: 333, quality: 480 },
    { itag: 334, quality: 720 },
    { itag: 335, quality: 1080 },
    { itag: 336, quality: 1440 },
    { itag: 337, quality: 2160 },
    { itag: 396, quality: 2160 },
    { itag: 397, quality: 1440 },
    { itag: 398, quality: 1080 },
    { itag: 779, quality: 1080 },
    { itag: 780, quality: 720 },
    { itag: 140, quality: "Audio" },
    { itag: 141, quality: "Audio" },
    { itag: 251, quality: "Audio" },
  ];

  const searchUrl = new URLSearchParams(url);
  const itag = searchUrl.get("itag");

  return qualities.find((quality) => quality.itag == itag)?.quality || "NA";
}
