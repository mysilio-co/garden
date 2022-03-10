import { namedNode } from '@rdf-esm/data-model';
import {
  createThing,
  asUrl,
  getUrlAll,
  getUrl,
  setUrl,
  addUrl,
  buildThing,
  Thing,
  UrlString,
  getSourceUrl,
} from '@inrupt/solid-client';
import { RDF, OWL } from '@inrupt/vocab-common-rdf';
import * as uuid from 'uuid';
import { base58 } from '@scure/base';
import { UUID, Base58Slug, Slug, MaybeIri } from './types';
import { Resource } from '@inrupt/solid-client/dist/interfaces';
import { urlObjectKeys } from 'next/dist/shared/lib/utils';

export function uuidUrn(): UUID {
  // https://stackoverflow.com/questions/20342058/which-uuid-version-to-use
  return namedNode(`urn:uuid:${uuid.v4()}`);
}

export function encodeBase58Slug(s: string): Base58Slug {
  return base58.encode(Buffer.from(s));
}

export function decodeBase58Slug(s: Base58Slug): string {
  return base58.decode(s).toString();
}

export function asIriString(iri: MaybeIri): string {
  return typeof iri === 'string' ? iri : iri.value;
}

export function isUUID(iri: MaybeIri): boolean {
  const url = new URL(asIriString(iri));
  return (
    url.protocol == 'urn:' &&
    url.pathname.indexOf('uuid:') == 0 &&
    uuid.validate(url.pathname.substring(5))
  );
}

export function getUUID(thing: Thing): UUID {
  const iri = asUrl(thing);
  if (isUUID(asUrl(thing))) {
    return namedNode(iri);
  } else {
    return namedNode(getUrlAll(thing, OWL.sameAs).find(isUUID));
  }
}

export function createThingWithUUID(): Thing {
  return createThing({ url: uuidUrn().value });
}

export function slugToUrl(resource: Resource, slug: Slug): UrlString {
  return new URL(getSourceUrl(resource), `#${slug}`).toString();
}

export function createPtr(slug: Slug, uuid: UUID) {
  return buildThing(createThing({ name: slug }))
    .addUrl(OWL.sameAs, uuid)
    .build();
}


export function hasRDFTypes(thing: Thing, ts: MaybeIri[]) {
  const types = getUrlAll(thing, RDF.type);
  let hasAllTypes = true;
  for (let t of ts) {
    hasAllTypes = hasAllTypes && types.includes(asIriString(t));
  }
  return hasAllTypes;
}

export function hasRDFType(thing: Thing, t: MaybeIri) {
  return hasRDFTypes(thing, [t]);
}

export function addRDFTypes(thing: Thing, ts: MaybeIri[]) {
  for (const t of ts) {
    thing = addRDFType(thing, t);
  }
  return thing;
};

export function addRDFType(thing: Thing, t: MaybeIri) {
  return addUrl(thing, RDF.type, t);
};

export function ensureUrl(
  thing: Thing,
  url: MaybeIri,
  value: MaybeIri
): Thing {
  if (!thing || !url || !value || getUrl(thing, url)) {
    return thing;
  } else {
    return setUrl(thing, url, value);
  }
}