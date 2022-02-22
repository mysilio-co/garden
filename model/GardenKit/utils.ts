import { MY } from "./vocab";
import {
  createThing,
  asUrl,
  getUrlAll,
  getUrl,
  setUrl,
  addStringNoLocale,
  buildThing,
  Thing,
  IriString,
  UrlString,
} from '@inrupt/solid-client';
import { FOAF, RDF, OWL } from '@inrupt/vocab-common-rdf';
import * as uuid from 'uuid';
import * as base58 from "micro-base58";
import { UrnString, UUIDString } from "./types";

export function uuidUrn(): UUIDString {
  // https://stackoverflow.com/questions/20342058/which-uuid-version-to-use
  return `urn:uuid:${uuid.v4()}`;
}

export function base58Urn(s: string): UrnString {
  return `urn:base58:${base58.encode(s)}`;
}

export function isUUID(iri: IriString): boolean {
  const url = new URL(iri);
  return (
    url.protocol == 'urn:' &&
    url.pathname.indexOf('uuid:') == 0 &&
    uuid.validate(url.pathname.substring(5))
  );
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
  return createThing({ url: uuidUrn() });
}

export function createPtr(slug: string, uuid: UUIDString) {
  return buildThing(createThing({ name: slug }))
    .addUrl(OWL.sameAs, uuid)
    .build();
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

export function addRDFTypes(thing: Thing, ts: IriString[]) {
  for (const t of ts) {
    thing = addRDFType(thing, t);
  }
  return thing;
};

export function addRDFType(thing: Thing, t: IriString[]) {
  return addStringNoLocale(thing, RDF.type, t);
};

export function ensureUrl(
  thing: Thing,
  url: UrlString,
  value: UrlString
): Thing {
  if (!thing || !url || !value || getUrl(thing, url)) {
    return thing;
  } else {
    return setUrl(thing, url, value);
  }
}