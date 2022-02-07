import {
  Concept,
  GardenImage,
  GardenFile,
  GardenBookmark,
  GardenNote,
} from './types';
import { hasRDFType } from './rdf';
import { MY } from './vocab';

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

export function asImage(concept: Concept): GardenImage | undefined {
  if (isImage(concept)) {
    return concept;
  } else {
    return undefined;
  }
}

export function asFile(concept: Concept): GardenFile | undefined {
  if (isFile(concept)) {
    return concept;
  } else {
    return undefined;
  }
}

export function asBookmark(concept: Concept): GardenBookmark | undefined {
  if (isBookmark(concept)) {
    return concept;
  } else {
    return undefined;
  }
}

export function asNote(concept: Concept): GardenNote | undefined {
  if (isNote(concept)) {
    return concept;
  } else {
    return undefined;
  }
}

export function createImage(): GardenImage {
  return buildThing(createThingWithUUID())
    .addUrl(RDF.type, SIOC.Container)
    .addUrl(RDF.type, MY.News.Newsletter)
    .addStringNoLocale(DCTERMS.title, title)
    .build();
}

export function createFile(): GardenFile {}

export function createBookmark(): GardenBookmark {}

export function createNote(): GardenNote {}
