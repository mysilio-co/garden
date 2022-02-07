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
} from '@inrupt/solid-client';

export function addItem(garden: Garden, item: GardenItem): Garden {
  // TODO: should throw if the item already exists
  return setThing(garden || createSolidDataset(), item);
}

export function addBookmark(garden: Garden, url: string, og?: OGTags): Garden {
  // TODO: should use UUIDs 
  const builder = buildThing(createThing({ url }))
    .addUrl(RDF.type, MY.Garden.Bookmark)
    .addDatetime(DCTERMS.modified, new Date())
    .addDatetime(DCTERMS.created, new Date());
  if (og) {
    builder
      .addUrl(FOAF.depiction, og && og.ogImage.url)
      .addStringNoLocale(DCTERMS.title, og && og.ogTitle)
      .addStringNoLocale(DCTERMS.description, og && og.ogDescription);
  }
  const bookmark = builder.build();
  return setThing(garden || createSolidDataset(), bookmark);
}

export function addImage(
  garden: Garden,
  url: string,
  fileData: File
): Garden {
  // TODO: should use UUIDs 
  const image = buildThing(createThing({ url }))
    .addUrl(RDF.type, MY.Garden.Image)
    .addUrl(RDF.type, FOAF.Image)
    .addDatetime(DCTERMS.modified, new Date())
    .addDatetime(DCTERMS.created, new Date(fileData.lastModified))
    .addStringNoLocale(DCTERMS.title, fileData.name)
    .addStringNoLocale(DCTERMS.format, fileData.type)
    .build();

  return setThing(garden || createSolidDataset(), image);
}

export function addFile(
  garden: Garden,
  url: string,
  fileData: File
): Garden {
  // TODO: should use UUIDs 
  const file = buildThing(createThing({ url }))
    .addUrl(RDF.type, MY.Garden.File)
    .addDatetime(DCTERMS.modified, new Date())
    .addDatetime(DCTERMS.created, new Date(fileData.lastModified))
    .addStringNoLocale(DCTERMS.title, fileData.name)
    .addStringNoLocale(DCTERMS.format, fileData.type)
    .build();

  return setThing(garden || createSolidDataset(), file);
}

function setItem(garden: Garden, item: GardenItem): Garden {
  return setThing(garden || createSolidDataset(), item);
}

function deleteItem(garden: Garden, item: GardenItem): Garden {}

function findItemByUUID(garden: Garden, uuid: UUID): GardenItem {}

function findItemByName(garden: Garden, name: string): GardenItem {}

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
