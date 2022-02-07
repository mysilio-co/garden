import { MY } from "./vocab";
import {
  createThing,
  asUrl,
  getUrlAll,
  Thing,
  IriString,
} from '@inrupt/solid-client';
import { FOAF, RDF, OWL } from '@inrupt/vocab-common-rdf';
import * as uuid from 'uuid';
import { UUIDString } from "./types";

export function uuidString(): UUIDString {
  // https://stackoverflow.com/questions/20342058/which-uuid-version-to-use
  return `urn:uuid:${uuid.v4()}`;
}

export function isUUID(iri: IriString): boolean {
  const url = new URL(iri);
  return url.protocol == 'urn:' && url.pathname.indexOf('uuid:') == 0;
}

export function getUUID(thing: Thing): UUIDString {
  const iri = asUrl(thing);
  if (isUUID(asUrl(thing))) {
    return iri;
  } else {
    return getUrlAll(thing, OWL.sameAs).find(isUUID);
  }
}

export function createThingWithUUID(): Thing {
  return createThing({ url: uuidString() });
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