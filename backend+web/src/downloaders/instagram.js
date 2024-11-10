import { savefrom } from "@bochilteam/scraper-savefrom";

export default async function instagramDownload(url) {
  try {
    const response = await savefrom(url);
    const refinedResponse = {
      title: response[0].meta.title,
      thumb: response[0].thumb,
      source: response[0].meta.source,
      qualities: response[0].url.map((urlObj) => ({
        url: urlObj.url,
        type: urlObj.name,
        quality: "HD",
      })),
    };

    return refinedResponse;
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Something Went Wrong during youtube Data Fetching!"
    );
  }
}
