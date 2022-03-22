import {
  Concept,
  ImageConcept,
  FileConcept,
  BookmarkConcept,
  NoteConcept,
  PersonConcept,
  Collection,
  GardenItem,
} from './types';
import {
  buildThing,
  getStringNoLocale,
  setStringNoLocale,
  getUrl,
  setUrl,
  UrlString,
  WebId,
} from '@inrupt/solid-client';
import { SKOS, FOAF, DCTERMS } from '@inrupt/vocab-common-rdf';
import { MY, SIOC } from './vocab';
import {
  hasRDFType,
  createThingWithUUID,
  addRDFTypes,
  addRDFType,
} from './utils';

interface CreateItemOptions {
  title?: string;
  description?: string;
  depiction?: UrlString;
}

interface UploadOptions {
  format?: string;
}

interface PersonOptions {
  nick?: string;
}

type CreateUploadOptions = CreateItemOptions & UploadOptions;
type CreatePersonOptions = CreateItemOptions & PersonOptions;
type Options = CreatePersonOptions & CreateUploadOptions;

export function isImage(concept: Concept): boolean {
  return hasRDFType(concept, MY.Garden.Image);
}

export function isFile(concept: Concept): boolean {
  return hasRDFType(concept, MY.Garden.File);
}

export function isBookmark(concept: Concept): boolean {
  return hasRDFType(concept, MY.Garden.Bookmark);
}

export function isNote(concept: Concept): boolean {
  return hasRDFType(concept, MY.Garden.Note);
}

export function isPerson(concept: Concept): boolean {
  return hasRDFType(concept, MY.Garden.Person);
}

export function getTitle(concept: Concept): string | undefined {
  return getStringNoLocale(concept, DCTERMS.title);
}

export function getDescription(concept: Concept): string | undefined {
  return getStringNoLocale(concept, DCTERMS.description);
}

export function getDepiction(concept: Concept): UrlString | undefined {
  return getUrl(concept, FOAF.depiction);
}

export function getCreator(concept: Concept): UrlString | undefined {
  return getUrl(concept, DCTERMS.creator);
}

export function getAbout(concept: Concept): UrlString | undefined {
  return getUrl(concept, SIOC.about)
}

export function setTitle(concept: Concept, title: string): Concept {
  return setStringNoLocale(concept, DCTERMS.title, title);
}

export function setDescription(concept: Concept, description: string): Concept {
  return setStringNoLocale(concept, DCTERMS.description, description);
}

export function setDepiction(concept: Concept, depiction: UrlString): Concept {
  return setUrl(concept, FOAF.depiction, depiction);
}

export function setCreator(concept: Concept, webId: WebId): Concept {
  return setUrl(concept, DCTERMS.creator, webId);
}

export function setAbout(concept: Concept, about: UrlString): Concept {
  return setUrl(concept, SIOC.about, about);
}

function createItem(webId: WebId, uuid?: UUID) {
  return buildThing(createThingWithUUID())
    .addUrl(DCTERMS.creator, webId)
    .addDatetime(DCTERMS.created, new Date())
    .addDatetime(DCTERMS.modified, new Date())
    .build();
}

function setOptions(item: GardenItem, options: Options): GardenItem {
  if (options && options.title) {
    item = setStringNoLocale(item, DCTERMS.title, options.title);
  }
  if (options && options.format) {
    item = setStringNoLocale(item, DCTERMS.format, options.format);
  }
  if (options && options.description) {
    item = setStringNoLocale(item, DCTERMS.description, options.description);
  }
  if (options && options.depiction) {
    item = setStringNoLocale(item, FOAF.depiction, options.depiction);
  }
  if (options && options.depiction) {
    item = setStringNoLocale(item, FOAF.depiction, options.depiction);
  }
  if (options && options.nick) {
    item = setStringNoLocale(item, FOAF.nick, options.nick);
  }
  return item;
};

export function createConcept(
  webId: WebId,
  about: UrlString,
  options?: Options
): Concept {
  let concept = createItem(webId);
  concept = addRDFTypes(concept, [SKOS.Concept, MY.Garden.Concept, SIOC.Item]);
  concept = setOptions(concept, options);
  concept = setAbout(concept, about);
  return concept;
}

export function createImage(
  webId: WebId,
  about: UrlString,
  options?: CreateUploadOptions
): ImageConcept {
  let image = createConcept(webId, about, options);
  image = addRDFType(image, MY.Garden.Image);
  return image;
}

export function createFile(
  webId: WebId,
  about: UrlString,
  options?: CreateUploadOptions
): FileConcept {
  let file = createConcept(webId, about, options);
  file = addRDFType(file, MY.Garden.File);
  return file;
}

export function createBookmark(
  webId: WebId,
  about: UrlString,
  options?: CreateItemOptions,
): BookmarkConcept {
  let bookmark = createConcept(webId, about, options);
  bookmark = addRDFType(bookmark, MY.Garden.Bookmark);
  return bookmark;
}

export function createNote(
  webId: WebId,
  about: UrlString,
  options?: CreateItemOptions
): NoteConcept {
  let note = createConcept(webId, about, options);
  note = addRDFType(note, MY.Garden.Note);
  return note;
}

export function createPerson(
  webId: WebId,
  about: WebId,
  options?: CreatePersonOptions
): PersonConcept {
  let person = createConcept(webId, about, options);
  person = addRDFType(person, MY.Garden.Person);
  return person;
}

export function createCollection(
  webId: WebId,
  options?: CreateItemOptions
): Collection {
  let collection = createItem(webId);
  collection = setOptions(collection, options);
  collection = addRDFTypes(collection, [SKOS.Collection, MY.Garden.Collection]);
  return collection
};