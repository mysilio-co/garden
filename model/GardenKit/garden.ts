import {
  Garden,
  GardenIndex,
  GardenItem,
  OGTags,
  GardenConfig,
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
} from '@inrupt/solid-client';
import { createBookmark, createFile, createImage, createNote } from './concepts';
import useGarden from './hooks';

export function addItem(garden: Garden, item: GardenItem): Garden {
  // TODO: should throw if the item already exists
  return setThing(garden || createSolidDataset(), item);
}
export function setItem(garden: Garden, item: GardenItem): Garden {
  return setThing(garden || createSolidDataset(), item);
}

export function deleteItem(garden: Garden, item: GardenItem): Garden {}

export function getItemByUUID(garden: Garden, uuid: UUIDString): GardenItem {
  return getThing(garden, uuid);
}

export function getItemByName(garden: Garden, name: string): GardenItem {

}

export function loadGarden(index: GardenIndex): Garden {}

export async function saveGarden(index: GardenIndex, garden: Garden): Promise<Garden> {
  return await saveSolidDatasetAt(index, garden);
}

export function getGardenConfig(garden: Garden): GardenConfig {
  const cfg = getThing(garden, getSourceUrl(garden));
  // test if this is main or shard index
  return  cfg
}
export function createNewGardenShard(
  mainIndex: GardenIndex,
  shardIndex: GardenIndex
): Garden {
  // setup an empty Garden subindex at the given subindex iri
  // linked to the given main index iri
}

function createGardenConfig(index: GardenIndex): GardenConfig {
  return buildThing(createThing({ url: index }))
    .addUrl(RDF.type, MY.Garden.Garden)
    .addUrl(MY.Garden.mainIndex, index)
    .build();
}

export function createNewGarden(index: GardenIndex): Garden {
  const emptyGarden = createSolidDataset();
  const config = createGardenConfig(index); 
  const gardenWithConfig = setThing(emptyGarden, config);
  return gardenWithConfig;
}

export async function createAndSaveGarden(index: GardenIndex): Promise<Garden> {
  return await saveGarden(index, createNewGarden(index));
}