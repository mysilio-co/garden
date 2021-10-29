import { US, MY } from "../vocab";
import {
  createThing,
  addUrl,
  setThing,
  createSolidDataset,
  setDatetime,
  getDatetime,
  getUrl,
  setUrl,
  getUrlAll,
  Thing,
  IriString,
  Iri,
} from '@inrupt/solid-client';
import { FOAF, DCTERMS, RDF } from "@inrupt/vocab-common-rdf";

export function hasUSNote(thing: Thing): boolean {
  return !!getUrl(thing, US.storedAt);
}

export function isConcept(thing: Thing): boolean {
  return hasUSNote(thing);
}

export function hasRDFTypes(thing: Thing, ts: IriString[]): boolean {
  const types = getUrlAll(thing, RDF.type);
  let hasAllTypes = true;
  for (let t of ts) {
    hasAllTypes = hasAllTypes && types.includes(t);
  }
  return hasAllTypes;
}

export function hasRDFType(thing: Thing, t: IriString): boolean {
  return hasRDFTypes(thing, [t]);
}

export function isBookmark(thing: Thing): boolean {
  return hasRDFType(thing, MY.SKOS.Bookmark);
}

export function isBookmarkedImage(thing: Thing): boolean {
  return hasRDFTypes(thing, [MY.SKOS.Bookmark, FOAF.Image]);
}

export function isBookmarkedLink(thing: Thing): boolean {
  return hasRDFTypes(thing, [MY.SKOS.Bookmark, MY.FOAF.Link]);
}

export function isBookmarkedFile(thing: Thing): boolean {
  return hasRDFTypes(thing, [MY.SKOS.Bookmark, MY.FOAF.File]);
}
