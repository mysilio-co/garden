import {
  Garden,
  GardenIndex,
  GardenItem,
  UUID,
  OGTags,
} from './types';
import { SKOS, RDF, FOAF, DCTERMS } from '@inrupt/vocab-common-rdf';
import { MY } from './vocab';
import {
  Thing,
  SolidDataset,
  createThing,
  buildThing,
  setThing,
  getThing,
  createSolidDataset,
  UrlString,
  Url,
} from '@inrupt/solid-client';
import { createBookmark, createFile, createImage, createNote } from './concepts';

export function addItem(garden: Garden, item: GardenItem): Garden {
  // TODO: should throw if the item already exists
  return setThing(garden || createSolidDataset(), item);
}

export function addBookmark(
  garden: Garden,
  url: UrlString,
  og?: OGTags
): Garden {
  return addItem(garden, createBookmark(url, og));
}

export function addImage(
  garden: Garden,
  url: UrlString,
  fileData: File
): Garden {
  return addItem(garden, createImage(url, fileData));
}

export function addFile(
  garden: Garden,
  url: UrlString,
  fileData: File
): Garden {
  return addItem(garden, createFile(url, fileData));
}

export function addNote(garden: Garden, url: UrlString): Garden {
  return addItem(garden, createNote(url));
};

function setItem(garden: Garden, item: GardenItem): Garden {
  return setThing(garden || createSolidDataset(), item);
}

function deleteItem(garden: Garden, item: GardenItem): Garden {}

function getItemByUUID(garden: Garden, uuid: UUIDString): GardenItem {
  return getThing(garden, uuid);
}

function getItemByName(garden: Garden, name: string): GardenItem {}

function loadGarden(index: GardenIndex): Garden {}

function saveGarden(index: GardenIndex, garden: Garden): Garden {}

function createNewGardenShard(
  mainIndex: GardenIndex,
  shardIndex: GardenIndex
): Garden {
  // setup an empty Garden subindex at the given subindex iri
  // linked to the given main index iri
}

function createNewGarden(index: GardenIndex): Garden {
  // setup an empty Garden index at the given iri
}
