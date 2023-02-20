import {
  getDescription,
  getTitle,
  getUUID,
  getItemAll,
  MY,
  getNote,
  getNoteValue,
  thingsToArray,
  noteThingToSlateObject,
} from 'garden-kit';
import { setDatetime } from '@inrupt/solid-client/thing/set';
import {
  createThing,
  setThing,
  getThing,
} from '@inrupt/solid-client/thing/thing';
import { getSourceUrl } from '@inrupt/solid-client/resource/resource';
import { overwriteFile } from '@inrupt/solid-client/resource/file';
import {
  saveSolidDatasetAt,
  getSolidDataset,
} from '@inrupt/solid-client/resource/solidDataset';
import { getDatetime, getUrl } from '@inrupt/solid-client/thing/get';
import { DCTERMS } from '@inrupt/vocab-common-rdf';
import Fuse from 'fuse.js';

export function defaultFuseIndexUrl(gardenUrl) {
  return gardenUrl.replace(/(\.ttl$)/, '-fuse.json');
}

export function defaultOptions(keys) {
  return {
    includeScore: true,
    threshold: 0.3,
    keys: keys,
  };
}

function fuseEntryFromGardenItem(item) {
  return {
    title: getTitle(item),
    description: getDescription(item),
    uuid: getUUID(item),
  };
}

export function fuseEntriesFromGardenItems(items) {
  const keys = ['title', 'description'];
  return {
    entries: items.map(fuseEntryFromGardenItem),
    keys: keys,
    options: defaultOptions(keys),
  };
}

async function fullTextFuseEntryFromGardenItem(item, options) {
  const noteBodyResourceUrl = item && getNote(item);
  const noteResource = await getSolidDataset(noteBodyResourceUrl, options);
  const noteBody = getThing(noteResource, noteBodyResourceUrl);
  const valueThing = getThing(noteResource, noteBody && getNoteValue(noteBody));

  const value =
    valueThing &&
    noteResource &&
    thingsToArray(valueThing, noteResource, noteThingToSlateObject);

  const valueStr = JSON.stringify(value);
  const itemEntry = fuseEntryFromGardenItem(item);
  return {
    ...itemEntry,
    fullText: valueStr,
  };
}

export async function fullTextFuseEntriesFromGardenItems(items, options) {
  const entries = await Promise.all(
    items.map((item) => fullTextFuseEntryFromGardenItem(item, options))
  );
  const keys = ['title', 'description', 'fullText'];
  return {
    entries: entries,
    keys: keys,
    options: defaultOptions(keys),
  };
}

async function setupOrUpdateGardenSearchIndex(garden, fuseIndexUrl, { fetch }) {
  const gardenUrl = getSourceUrl(garden);
  const fuseIndexInfo = getThing(garden, fuseIndexUrl);
  const fuseLastModified =
    fuseIndexInfo && getDatetime(fuseIndexInfo, DCTERMS.modified);
  const fuseResp =
    fuseLastModified &&
    (await fetch(fuseIndexUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }));
  const fuseIndex = fuseResp && Fuse.parseIndex(await fuseResp.json());

  const allItems = getItemAll(garden);
  if (allItems.length > 0) {
    let itemsToUpdate = [];
    if (fuseLastModified) {
      for (const item of allItems) {
        if (getDatetime(item, DCTERMS.modified) > fuseLastModified) {
          itemsToUpdate = [...itemsToUpdate, item];
        }
      }
    } else {
      itemsToUpdate = allItems;
    }

    if (itemsToUpdate.length > 0) {
      const { entries: entriesToUpdate } =
        await fullTextFuseEntriesFromGardenItems(itemsToUpdate, { fetch });
      console.log(`Entries to update: ${entriesToUpdate.length}`);
      const { entries: allEntries, options } =
        fuseEntriesFromGardenItems(allItems);
      console.log(`Total entries: ${allEntries.length}`);

      let fuse;
      if (fuseIndex) {
        fuse = new Fuse(allEntries, options, fuseIndex);
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
      } else {
        fuse = new Fuse(entriesToUpdate, options);
      }

      const updatedIndex = fuse.getIndex();
      console.log('Updating saved json index');
      const buf = Buffer.from(JSON.stringify(updatedIndex.toJSON()));
      await overwriteFile(fuseIndexUrl, buf, {
        fetch,
        contentType: 'application/json',
      });

      const updatedFuseIndexInfo = setDatetime(
        fuseIndexInfo || createThing({ url: fuseIndexUrl }),
        DCTERMS.modified,
        new Date()
      );
      await saveSolidDatasetAt(
        gardenUrl,
        setThing(garden, updatedFuseIndexInfo),
        {
          fetch,
        }
      );
    } else {
      console.log(
        `Index last modified at ${fuseLastModified}.  Nothing to update.`
      );
    }
  }
}

export async function setupGardenSearchIndex(
  gardenUrl,
  fuseIndexUrl,
  { fetch }
) {
  console.log(
    `Setting up garden search index for ${gardenUrl} at ${fuseIndexUrl}`
  );
  const garden = await getSolidDataset(gardenUrl, { fetch });
  return setupOrUpdateGardenSearchIndex(garden, fuseIndexUrl, { fetch });
}

export async function updateGardenSearchIndex(gardenUrl, { fetch }) {
  console.log(`Updating garden search index for ${gardenUrl}`);
  const garden = await getSolidDataset(gardenUrl, { fetch });
  const gardenSettings = getThing(garden, gardenUrl);
  const fuseIndexUrl = getUrl(gardenSettings, MY.Garden.hasFuseIndex);
  if (fuseIndexUrl) {
    console.log(`Found garden search index at ${fuseIndexUrl}`);
    return setupOrUpdateGardenSearchIndex(garden, fuseIndexUrl, { fetch });
  } else {
    throw new Error(`No fuseIndex configured for garden: ${gardenUrl}`);
  }
}

export function fuseWebhookUrl(gardenUrl) {
  return (
    `https://${window.location.host}` +
    `/api/garden/${encodeURIComponent(gardenUrl)}/fuse/webhook`
  );
}

export async function setupGardenSearchIndexAPI(gardenUrl, fuseIndexUrl) {
  const apiUrl =
    `/api/garden/${encodeURIComponent(gardenUrl)}` +
    `/fuse/setup/${encodeURIComponent(fuseIndexUrl)}`;
  console.log(apiUrl);
  return await fetch(apiUrl, {
    method: 'GET',
  });
}
