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
  thingBuilder,
} from '@inrupt/solid-client';
import { getTitle, getDescription, getDepiction } from 'garden-kit';
import { RDFS } from '@inrupt/vocab-common-rdf';

// Expected Permissions for this file:
// Public: Append only
const DWC_URL =
  process.env.DWEB_CAMP_RESOURCE_URL ||
  'https://ian.mysilio.me/public/test/dweb-camp.ttl';

function createPointer(uuidUrn, resourceUrl) {
  return thingBuilder(createThing({ url: uuidUrn }))
    .addUrl(RDFS.seeAlso, resourceUrl)
    .build();
}

async function getDWCIndex() {
  console.log(`Fetching DWeb Camp Index from ${DWC_URL}`);
  return await getSolidDataset(DWC_URL);
}

async function saveDWCIndex(newIndex) {
  console.log(`Saving DWeb Camp Index to ${DWC_URL}`);
  return await saveSolidDatasetAt(newIndex, DWC_URL);
}

async function addToDWCGarden(uuid, resourceUrl) {
  console.log(`Checking DWeb Camp Garden for ${uuidUrn}: ${resourceUrl}`);
  const index = getDWCIndex();
  let gardenPointer = getThing(index, uuidUrn);
  if (gardenPointer) {
    const existingUrl = getUrl(gardenPointer, RDFS.seeAlso);
    throw new Error(
      `${uuidUrn}: ${existingUrl} already exists in DWeb Camp Garden`
    );
  }

  console.log(`Try adding pointer for ${uuidUrn}: ${resourceUrl}`);
  index = setThing(index, createPointer(uuidUrn, resourceUrl));
  try {
    index = await saveDWCIndex(index);
  } catch (error) {
    console.log(error);
    throw new Error('Content with that UUID has already been indexed');
  }

  console.log(`Added ${uuidUrn}: ${resourceUrl} to DWeb Camp Garden`);
  return index;
}

async function getDWCGarden() {
  const index = getDWCIndex();
  const uuidThings = getThingAll(index);
  const fullThings = async () => {
    return Promise.all(
      uuidThings.map(async (thing) => {
        const uuidUrn = asUrl(thing);
        const resourceUrl = getUrl(thing, RSFS.seeAlso);
        const dataset = await getSolidDataset(resourceUrl);
        const fullThing = getThing(dataset, uuidUrn);
        return setUrl(fullThing, RDFS.seeAlso, resourceUrl);
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
    const { uuidUrn, resourceUrl } = req.body;
    try {
      const gardenIndex = await addToDWCGarden(uuidUrn, resourceUrl);
      const gardenIndexJSON = getThingAll(gardenIndex).map((thing) => {
        return {
          uuid: asUrl(thing),
          seeAlso: getUrl(thing, RDFJS.seeAlso),
        };
      });
      return res.json(gardenIndexJSON);
    } catch (error) {
      return res.status(409).json({
        message: error.message,
      });
    }
  } else if (req.method === 'GET') {
    // From Vercel docs: "[This] tells our CDN: serve from cache, but update it, if requested after 1 minute."
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    const garden = getDWCGarden();
    const gardenJSON = getThingAll(garden).map((thing) => {
      return {
        uuid: asUrl(thing),
        seeAlso: getUrl(thing, RDFJS.seeAlso),
        title: getTitle(thing),
        description: getDescription(thing),
        depiction: getDepiction(thing),
      };
    });
    return res.json(gardenJSON);
  } else {
    return res.status(405).json({ message: 'Only supports GET and POST' });
  }
};