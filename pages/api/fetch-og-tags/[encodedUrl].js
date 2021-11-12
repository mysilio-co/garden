/* GetOGTags

Fetches a website and returns the OG tags.
Useful for creating Bookmarks.

  GET /api/fetch-og-tags/[encodedUrl].js
*/

import * as ogs from 'open-graph-scraper';

export default async function handler(req, res) {
  const { encodedUrl } = req.query;
  const url = decodeURIComponent(encodedUrl);
  const options = { url }; 
  console.log(`fetching OG tags for ${url}:`);
  try {
    const { error, result, response } = await ogs(options);

    console.log(result);
    res.json(result);
  } catch (e) {
    res.status(404);
    res.json({});
  }
};
