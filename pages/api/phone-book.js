
/* Add or Find someone in the phone book

  POST /api/phone-book
  - expected body: {username, webid}
  Will create a new entry in the phone-book if one doesn't already exist.
  Relies on having Append access to the phone book resource.
  If given Write access, this function may overwrite previous entries in certain race conditions.
  --> returns {username, webid}

  GET /api/phone-book?username=[username]
  - expected query: {username}
  An SWR cached lookup of a given username in the phone book.
  --> returns { username, webid }
*/
import {
  createSolidDataset,
  createThing,
  getSolidDataset,
  getThing,
  getUrl,
  saveSolidDatasetAt,
  setThing,
  thingBuilder
} from '@inrupt/solid-client';
import { OWL, RDFS, FOAF } from '@inrupt/vocab-common-rdf';

import { universalAccess } from "@inrupt/solid-client";
import { create } from 'yup/lib/Reference';
import { setPlatePlugins } from '@udecode/plate-headless';

// Expected Permissions for this folder:
// Public: Append only
const PBURL = process.env.PHONE_BOOK_BASE_URL

// Expected Permissions for index:
// Public: Append only
const IndexUrl = `${PBURL}index.ttl`;

function urlForWebId(webId) {
  return `${PBURL}${webId}.ttl`;
}

function urlForUsername(username) {
  return `${PBURL}index.ttl#${username}`;
}

async function createIndexEntry(username, webId) {
  return thingBuilder(createThing({ name: username }))
    .addUrl(RDFS.seeAlso, urlForWebId(webId))
    .addUrl(OWL.sameAs, webId)
    .build();
}

async function addPhoneBookEntry(index, addToIndex, username, webId) {
 let indexEntry = getThing(index, urlForUsername(username));
  if (indexEntry) {
    return res.status(409).json({
      message: 'That username is already taken.',
    });
  }

  index = await addToIndex(createIndexEntry(username, webId));
  indexEntry = getThing(index, urlForUsername(username));
  let entry = createSolidDataset()
  const profile = thingBuilder(createThing({ url: webId }))
    .addStringNoLoca(FOAF.nick, username)
    .build();
  entry = setThing(entry, profile);
  entry = await saveSolidDatasetAt(entry, urlForWebId(webId));

  // Only login for this last bit,
  // everything else can be done as the Public agent
  const client = new SolidNodeClient();
  const session = await client.login();
  if (!session.isLoggedIn) {
    return res.status(500).json({
      message: `Unable to authenticate as machine user. The supplied crendentials may be invalid or expired.`,
    });
  }

  await universalAccess.setAgentAccess(
    urlForWebId(webId), // Resource
    webId, // Agent
    { write: true }, // Access object
    { fetch: client.fetch } // fetch function from authenticated session
  );

  return index;
}
async function getPhoneBookEntry(index, username) {
  console.log(`Looking up entry in phone book for username ${username}:`);
  const indexEntry = getThing(index, urlForUsername )
  const webId = getUrl(indexEntry, OWL.sameAs);
  const fullEntry = getUrl(indexEntry, RDFS.seeAlso);

  return {
    username: username,
    webId: webId,
    entry: fullEntry,
  };
}

export default async function handler(req, res) {
  const index = await getSolidDataset(IndexUrl);
  const addToIndex = async function (newIndexEntry) {
    const newIndex = setThing(index, newIndexEntry);
    return await saveSolidDatasetAt(newIndex, IndexUrl);
  };
  if (req.method === 'POST') {
    const { username, webid } = req.body;
    if (getWebId(pb, username)) {
      return res.status(409).json({
        message: 'Username already taken',
      });
    }

  } else if (req.method === 'GET') {
    const { username } = req.query;
    // From Vercel docs: "[This] tells our CDN: serve from cache, but update it, if requested after 1 second."
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');

    // should be publicly readable
    const webId = getPhoneBookEntry(pbEntry, OWL.sameAs);
    if (!webId) {
      res.status(404).json({
        message: `No WebId registered for username ${username}`,
      });
    } else {
      res.json({
        username: username,
        webId: webId,
      });
    }
  } else {
    return res.status(405).json({ message: 'Only supports GET and POST' });
  }
};
