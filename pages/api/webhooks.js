import { verifyAuthIssuer } from 'solid-webhook-client';
import { Session } from '@inrupt/solid-client-authn-node';
import {
  getDatetime,
  getSolidDataset,
  getThing,
  getUrl,
  saveSolidDatasetAt,
  setDatetime,
  setThing,
} from '@inrupt/solid-client';
import { getItemAll, getUUID, MY } from 'garden-kit';
import { DCTERMS } from '@inrupt/vocab-common-rdf';
import Fuse from 'fuse.js';
import {
  fullTextFuseEntriesFromGardenItems,
  fuseEntriesFromGardenItems,
} from '../../model/search';

const ClientID = process.env.MKG_CLIENT_ID;
const ClientSecret = process.env.MKG_CLIENT_SECRET;
const IDP = process.env.MKG_IDP;

async function updateGardenSearchIndex(gardenUrl) {
  const session = new Session();
  await session.login({
    clientId: ClientID,
    clientSecret: ClientSecret,
    oidcIssuer: IDP,
  });
  const { fetch } = session;
  const garden = await getSolidDataset(gardenUrl, { fetch });
  const gardenSettings = getThing(garden, gardenUrl);
  const fuseIndexUrl = getUrl(gardenSettings, MY.Garden.hasFuseIndex);
  if (fuseIndexUrl) {
    const fuseIndexInfo = getThing(garden, fuseIndexUrl);
    const fuseLastModifed = getDatetime(fuseIndexInfo, DCTERMS.modified);
    const fuseResp = await fetch(fuseIndexUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const fuseIndex = Fuse.parseIndex(await fuseResp.json());

    const allItems = getItemAll(garden);
    let itemsToUpdate;
    for (const item of allItems) {
      if (getDatetime(item, DCTERMS.modified) > fuseLastModifed) {
        itemsToUpdate = [...itemsToUpdate, item];
      }
    }

    const { entries: entriesToUpdate, keys: fullTextKeys } =
      await fullTextFuseEntriesFromGardenItems(itemsToUpdate);
    const { entries: allEntries, options } =
      fuseEntriesFromGardenItems(allItems);

    const fuse = new Fuse(allEntries, options, fuseIndex);
    const toRemove = new Set();
    for (const item of itemsToUpdate) {
      toRemove.add(getUUID(item));
    }
    fuse.remove((doc) => {
      return toRemove.has(doc.uuid);
    });
    for (const entry of entriesToUpdate) {
      fuse.add(entry);
    }
    const updatedIndex = fuse.getIndex();
    // TODO: probably don't have permission to write to this.
    await fetch(fuseIndexUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedIndex.toJSON()),
    });
    const updatedFuseIndexInfo = setDatetime(
      fuseIndexInfo,
      DCTERMS.modified,
      new Date()
    );
    await saveSolidDatasetAt(gardenUrl, setThing(garden, updatedFuseIndexInfo));
  } else {
    throw new Error(`No fuseIndex configured for garden: ${gardenUrl}`);
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Webhook POST received');
    console.log(req.body);
    const updatedResource = req.body.object.id;
    const resourceOrigin = new URL(updatedResource).origin;
    const verifiedIssuer = await verifyAuthIssuer(req.headers.authorization);
    if (verifiedIssuer === resourceOrigin) {
      await updateGardenSearchIndex(updatedResource);
      return res.status(200).json({ message: 'OK' });
    } else {
      const m = `This authorization header of this webhook is invalid. Header ${verifiedIssuer} does not match orign ${resourceOrigin}`;
      console.log(m);
      return res.status(401).json({
        message: m,
      });
    }
  } else {
    return res
      .status(405)
      .json({ message: 'The webhooks handler only accepts POST requests' });
  }
}
