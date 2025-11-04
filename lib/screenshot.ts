export async function generateScreenshot(url: string): Promise<string> {
  const screenshotUrl =
    `https://api.screenshotone.com/take?` +
    `access_key=${process.env.SCREENSHOTONE_API_KEY}` +
    `&url=${encodeURIComponent(url)}` +
    `&viewport_width=1920` +
    `&viewport_height=1080` +
    `&device_scale_factor=1` +
    `&format=png` +
    `&image_quality=80` +
    `&block_ads=true` +
    `&block_cookie_banners=true` +
    `&block_trackers=true` +
    `&cache=true` +
    `&cache_ttl=2592000`;

  return screenshotUrl;
}
