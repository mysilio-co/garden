/* Add and Remove content from the DWeb Camp Shared Garden

  POST /api/dweb-camp
  - expected body: { resourceUrl, uuidUrn }
  Will create a new entry in the DWeb Camp Resource if one doesn't already exist.
  Relies on having Append access to the DWeb Camp resource.
  If given Write access, this function may overwrite previous entries in certain race conditions.
  --> returns { dwebCampResource }

  GET /api/dweb-camp
  An SWR cached lookup of the full list of GardenItems shared with DWeb Camp
  --> returns { dwebCampResource }
*/

import {
  createThing,
  getSolidDataset,
  getThing,
  getUrl,
  setUrl,
  saveSolidDatasetAt,
  setThing,
  buildThing,
  getDatetime,
  getThingAll,
} from '@inrupt/solid-client';
import { getTitle, getDescription, getDepiction, getCreator } from 'garden-kit';
import { RDFS, DCTERMS } from '@inrupt/vocab-common-rdf';

// Expected Permissions for this file:
// Public: Append only
const DWC_URL =
  process.env.DWEB_CAMP_RESOURCE_URL ||
  'https://mysilio.me/ian/streams/dweb-camp.ttl';

const pinned = ['urn:uuid:508ca751-0e8f-4b25-a4a2-a15d63166ebe'];

function createPointer(uuidUrn, resourceUrl, href) {
  return buildThing(createThing({ url: uuidUrn }))
    .addUrl(RDFS.seeAlso, resourceUrl)
    .addUrl(DCTERMS.source, href)
    .build();
}

async function getDWCIndex() {
  console.log(`Fetching DWeb Camp Index from ${DWC_URL}`);
  const index = await getSolidDataset(DWC_URL);
  console.log(index);
  return index;
}

async function saveDWCIndex(newIndex) {
  console.log(`Saving DWeb Camp Index to ${DWC_URL}`);
  console.log(newIndex);
  return await saveSolidDatasetAt(DWC_URL, newIndex);
}

async function addToDWCIndex(uuidUrn, resourceUrl, href) {
  console.log(`Checking DWeb Camp Garden for ${uuidUrn}: ${resourceUrl}`);
  const index = await getDWCIndex();
  let gardenPointer = getThing(index, uuidUrn);
  if (gardenPointer) {
    const existingUrl = getUrl(gardenPointer, RDFS.seeAlso);
    throw new Error(
      `${uuidUrn}: ${existingUrl} already exists in DWeb Camp Garden`
    );
  }

  console.log(`Try adding pointer for ${uuidUrn}: ${resourceUrl}`);
  let newIndex = setThing(index, createPointer(uuidUrn, resourceUrl, href));
  newIndex = await saveDWCIndex(newIndex);

  console.log(`Added ${uuidUrn}: ${resourceUrl} to DWeb Camp Garden`);
  return newIndex;
}

async function getDWCStream() {
  const index = getDWCIndex();
  const uuidThings = getThingAll(index);
  const fullThings = async () => {
    return Promise.all(
      uuidThings.map(async (thing) => {
        const uuidUrn = asUrl(thing);
        const resourceUrl = getUrl(thing, RSFS.seeAlso);
        const href = getUrl(thing, DCTERMS.source);
        console.log(`Fetching ${uuidUrn} from ${resourceUrl}`);
        const dataset = await getSolidDataset(resourceUrl);
        let fullThing = getThing(dataset, uuidUrn);
        fullThing = setUrl(fullThing, RDFS.seeAlso, resourceUrl);
        fullThing = setUrl(fullThing, DCTERMS.source, href);
        return fullThing;
      })
    );
  };
  const garden = fullThings.reduce(
    (dataset, thing) => setThing(dataset, thing),
    createSolidDataset()
  );
  return garden;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body);
    const { uuidUrn, resourceUrl, href } = body;
    const newIndex = await addToDWCIndex(uuidUrn, resourceUrl, href);
    const newIndexJSON = getThingAll(newIndex).map((thing) => {
      return {
        uuid: asUrl(thing),
        seeAlso: getUrl(thing, RDFS.seeAlso),
        href: getUrl(thing, DCTERMS.source),
      };
    });
    return res.json(newIndexJSON);
  } else if (req.method === 'GET') {
    // From Vercel docs: "[This] tells our CDN: serve from cache, but update it, if requested after 1 minute."
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    const stream = getDWCStream();
    const streamJSON = getThingAll(stream).map((thing) => {
      return {
        uuid: asUrl(thing),
        seeAlso: getUrl(thing, RDFJS.seeAlso),
        creator: getCreator(thing),
        title: getTitle(thing),
        description: getDescription(thing),
        depiction: getDepiction(thing),
        lastEdit: getDatetime(thing, DCTERMS.modified),
        href: getUrl(thing, DCTERMS.source),
      };
    });
    return res.json(streamJSON);
  } else {
    return res.status(405).json({ message: 'Only supports GET and POST' });
  }
}
