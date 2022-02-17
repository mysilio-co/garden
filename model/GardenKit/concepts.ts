import {
  Concept,
  GardenImage,
  GardenFile,
  GardenBookmark,
  GardenNote,
  OGTags,
} from './types';
import {
  buildThing,
  getStringNoLocale,
  getUrl,
  UrlString,
  WebId,
} from '@inrupt/solid-client';
import {
  SKOS,
  RDF,
  FOAF,
  DCTERMS,
  SCHEMA_INRUPT,
} from '@inrupt/vocab-common-rdf';

import { MY } from './vocab';
import { hasRDFType, createThingWithUUID } from './utils';

type CreateConceptOptions = {
  rdfTypes?: [string];
  title?: string;
  description?: string;
  depiction?: UrlString;
  fileData?: File;
};

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

function createConcept(
  webId: WebId,
  url: UrlString,
  options?: CreateConceptOptions
): Concept {
  const builder = buildThing(createThingWithUUID())
    .addUrl(DCTERMS.creator, webId)
    .addUrl(SCHEMA_INRUPT.url, url)
    .addUrl(RDF.type, SKOS.Concept)
    .addUrl(RDF.type, MY.Garden.Concept)
    .addDatetime(DCTERMS.created, new Date())
    .addDatetime(DCTERMS.modified, new Date());

  if (options.title) {
    builder.addStringNoLocale(DCTERMS.title, options.title);
  } else if (options.fileData) {
    builder
      .addStringNoLocale(DCTERMS.title, options.fileData.name)
      .addStringNoLocale(DCTERMS.format, options.fileData.type);
  }
  if (options.description) {
    builder.addStringNoLocale(DCTERMS.description, options.description);
  }
  if (options.depiction) {
    builder.addStringNoLocale(FOAF.depiction, options.depiction);
  }
  if (options.rdfTypes) {
    for (const t of options.rdfTypes) {
      builder.addStringNoLocale(RDF.type, t);
    }
  }

  return builder.build();
}

export function createImage(
  webId: WebId,
  url: UrlString,
  fileData: File
): GardenImage {
  return createConcept(webId, url, { fileData, rdfTypes: [MY.Garden.Image] });
}

export function createFile(
  webId: WebId,
  url: UrlString,
  fileData: File
): GardenFile {
  return createConcept(webId, url, { fileData, rdfTypes: [MY.Garden.File] });
}

export function createBookmark(
  webId: WebId,
  url: UrlString,
  og?: OGTags
): GardenBookmark {
  if (og) {
    return createConcept(webId, url, {
      depiction: og.ogImage.url,
      title: og.ogTitle,
      description: og.ogDescription,
      rdfTypes: [MY.Garden.Bookmark],
    });
  } else {
    return createConcept(webId, url, { rdfTypes: [MY.Garden.Bookmark] });
  }
}

export function createNote(
  webId: WebId,
  url: UrlString,
  title?: string,
  description?: string,
  depiction?: UrlString
): GardenNote {
  return createConcept(webId, url, { rdfTypes: [MY.Garden.Note] });
}
