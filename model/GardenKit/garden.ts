import {
  Garden,
  GardenIndex,
  GardenItem,
  Workspace,
} from './types';
import { SKOS, RDF, FOAF, DCTERMS } from '@inrupt/vocab-common-rdf';
import { MY } from './vocab';
import {
  setThing,
  getThing,
  createSolidDataset,
  UrlString,
  getSourceUrl,
  createThing,
  saveSolidDatasetAt,
  buildThing,
  addUrl,
  WebId,
  removeThing,
} from '@inrupt/solid-client';
import { createBookmark, createFile, createImage, createNote } from './concepts';
import useGarden from './hooks';
import { getUUID, base58Urn, ensureUrl } from './rdf';

export function getItemByUUID(garden: Garden, uuid: UUIDString): GardenItem {
  return getThing(garden, uuid);
}

export function getItemBySlug(garden: Garden, slug: string): GardenItem {
  const ptr = getThing(garden, slug);
  const uuid = getUUID(ptr);
  return getItemByUUID(garden, uuid);
}

export function getItemByName(garden: Garden, name: string): GardenItem {
  const slug = base58Urn(name.toLowerCase())
  return getItemBySlug(garden, slug);

}