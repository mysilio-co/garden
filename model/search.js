import { getThing } from '@inrupt/solid-client';
import { getDescription, getTitle, getUUID } from 'garden-kit';

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

async function fullTextFuseEntryFromGardenItem(item) {
  const noteBodyResourceUrl = item && getNote(item);
  const noteResource = await getSolidDataset(noteBodyResourceUrl);
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

export async function fullTextFuseEntriesFromGardenItems(items) {
  const entries = await Promise.all(
    items.map((item) => fullTextFuseEntryFromGardenItem(item))
  );
  const keys = ['title', 'description', 'fullText'];
  return {
    entries: entries,
    keys: keys,
    options: defaultOptions(keys),
  };
}
