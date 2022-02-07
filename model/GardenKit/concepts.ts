import {
  Concept,
  GardenImage,
  GardenFile,
  GardenBookmark,
  GardenNote,
  OGTags,
} from './types';
import {
  buildThing, ThingBuilder, Url, UrlString,
} from '@inrupt/solid-client';
import { SKOS, RDF, FOAF, DCTERMS, SCHEMA_INRUPT } from '@inrupt/vocab-common-rdf';

import { MY } from './vocab';
import { hasRDFType, createThingWithUUID } from './rdf';

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

function buildConcept(url: UrlString): ThingBuilder {
  return buildThing(createThingWithUUID())
    .addUrl(SCHEMA_INRUPT.url, url)
    .addUrl(RDF.type, SKOS.Concept)
    .addUrl(RDF.type, MY.Garden.Concept)
    .addDatetime(DCTERMS.created, new Date())
    .addDatetime(DCTERMS.modified, new Date())
}

function buildConceptForUpload(url: UrlString, fileData: File): ThingBuilder {
  return buildThing(createThingWithUUID())
    .addUrl(SCHEMA_INRUPT.url, url)
    .addUrl(RDF.type, SKOS.Concept)
    .addUrl(RDF.type, MY.Garden.Concept)
    .addDatetime(DCTERMS.created, new Date(fileData.lastModified))
    .addDatetime(DCTERMS.modified, new Date())
    .addStringNoLocale(DCTERMS.title, fileData.name)
    .addStringNoLocale(DCTERMS.format, fileData.type)
}

export function createImage(url: UrlString, fileData: File): GardenImage {
  return buildConceptForUpload(url, fileData)
    .addUrl(RDF.type, MY.Garden.Image)
    .build();
}

export function createFile(url: UrlString, fileData: File): GardenFile {
  return buildConceptForUpload(url, fileData)
    .addUrl(RDF.type, MY.Garden.File)
    .build();
}

export function createBookmark(
  url: UrlString,
  og?: OGTags
): GardenBookmark {
  const builder = buildConcept(url)
    .addUrl(RDF.type, MY.Garden.Bookmark)
  if (og) {
    builder
      .addUrl(FOAF.depiction, og && og.ogImage.url)
      .addStringNoLocale(DCTERMS.title, og && og.ogTitle)
      .addStringNoLocale(DCTERMS.description, og && og.ogDescription);
  }
  return builder.build();
}

export function createNote(url: UrlString): GardenNote {
    return buildConcept(url)
      .addUrl(RDF.type, MY.Garden.Note)
      .build();
}
