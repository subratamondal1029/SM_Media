import { facebookdl } from "@bochilteam/scraper-facebook";

export default async function facebookDownload(url) {
  try {
    const response = await facebookdl(url);
    const refiendedResponse = {
      title: response.title ? response.title : "Facebook Video",
      thumb: response.thumbnail,
      source: url,
      duration: response.duration,
      qualities: await Promise.all(
        [...response.video, ...response.audio].map(async (data) => {
          return {
            quality: data.quality,
            type: data.quality.includes("kbps") ? "Audio" : "MP4",
            url: await data.download(),
          };
        })
      ),
    };
    return refiendedResponse;
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something Went Wrong during youtube Data Fetching!"
    );
  }
}
