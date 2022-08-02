
/* Add or Find someone in the phone book

  POST /api/phone-book
  - expected body: { username, webid }
  Will create a new entry in the phone-book if one doesn't already exist.
  Relies on having Append access to the phone book resource.
  If given Write access, this function may overwrite previous entries in certain race conditions.
  --> returns { username, webid }

  GET /api/phone-book?username=[username]
  - expected query: { username }
  An SWR cached lookup of a given username in the phone book.
  --> returns { username, webid, ...}
*/

import {
  createThing,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getUrl,
  saveSolidDatasetAt,
  setThing,
  thingBuilder
} from '@inrupt/solid-client';
import { OWL, FOAF } from '@inrupt/vocab-common-rdf';

// Expected Permissions for this file:
// Public: Append only
const PBURL =
  process.env.PHONE_BOOK_INDEX ||
  'https://ian.mysilio.me/public/test/phone-book.ttl';

function urlForUsername(username) {
  return `${PBURL}#${username}`;
}

function createIndexEntry(username, webId) {
  return thingBuilder(createThing({ name: username }))
    .addUrl(OWL.sameAs, webId)
    .build();
}

async function getIndex() {
  console.log(`Fetching index from ${PBURL}`);
  return await getSolidDataset(PBURL)
}

async function saveIndex(newIndex) {
  console.log(`Saving index to ${PBURL}`);
  return await saveSolidDatasetAt(newIndex, PBURL);
}

async function addPhoneBookEntry(index, username, webId) {
  console.log(
    `Checking entry ${username}: ${webId}`
  );
  let indexEntry = getThing(index, urlForUsername(username));
  if (indexEntry) {
    throw new Error('That username is already taken')
  }

  console.log(
    `Try adding entry for ${username}: ${webId}`
  );
  index = setThing(index, createIndexEntry(username, webId));
  try {
    index = await saveIndex(index);
  } catch (error) {
    console.log(error)
    throw new Error('That username is already taken')
  }

  console.log(`Added entry ${username}: ${webId}`);
  return index;
}

async function getPhoneBookEntry(index, username) {
  console.log(`Looking up entry ${username}`);
  const indexEntry = getThing(index, urlForUsername(username));
  const webId = getUrl(indexEntry, OWL.sameAs);
  const profile = await getSolidDataset(webId);
  const name = getStringNoLocale(profile, FOAF.name);

  return {
    username: username,
    webId: webId,
    name: name,
  };
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, webId } = req.body;
    let index = getIndex();
    try {
      index = await addPhoneBookEntry(index, username, webId);
    } catch (error) {
      return res.status(409).json({
        message: error.message,
      });
    }
    const entry = await getPhoneBookEntry(index, username);

    if (entry.webId !== webId) {
      return res.status(500).json({
        error: 'Something went wrong when trying to reserve your username.',
      });
    }

    return res.json(entry);
  } else if (req.method === 'GET') {
    const { username } = req.query;
    // From Vercel docs: "[This] tells our CDN: serve from cache, but update it, if requested after 1 second."
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');

    const entry = getPhoneBookEntry(username);
    if (!entry) {
      res.status(404).json({
        message: `No WebId registered for username ${username}`,
      });
    } else {
      res.json(entry);
    }
  } else {
    return res.status(405).json({ message: 'Only supports GET and POST' });
  }
};
