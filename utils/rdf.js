import { MY } from 'garden-kit/vocab'
import { getUrl, getUrlAll } from '@inrupt/solid-client/thing/get'
import { createThing, asUrl } from '@inrupt/solid-client/thing/thing'
import { uuidUrn } from '../utils/uris'
import { FOAF, DCTERMS, RDF, OWL } from '@inrupt/vocab-common-rdf'

/*export type IRI = string;
export type URN = IRI;
export type UUID = URN;
*/

export function isUUID(iri) {
  const url = new URL(iri)
  return url.protocol == 'urn:' && url.pathname.indexOf('uuid:') == 0
}

export function getUUID(thing) {
  const iri = asUrl(thing)
  if (isUUID(asUrl(thing))) {
    return iri
  } else {
    return getUrlAll(thing, OWL.sameAs).find(isUUID)
  }
}

export function createThingWithUUID() {
  return createThing({ url: uuidUrn() })
}

export function hasUSNote(thing) {
  return !!getUrl(thing, US.storedAt)
}

export function isConcept(thing) {
  return hasUSNote(thing)
}

export function hasRDFTypes(thing, ts) {
  const types = getUrlAll(thing, RDF.type)
  let hasAllTypes = true
  for (let t of ts) {
    hasAllTypes = hasAllTypes && types.includes(t)
  }
  return hasAllTypes
}

export function hasRDFType(thing, t) {
  return hasRDFTypes(thing, [t])
}

export function isBookmark(thing) {
  return hasRDFType(thing, MY.SKOS.Bookmark)
}

export function isBookmarkedImage(thing) {
  return hasRDFTypes(thing, [MY.SKOS.Bookmark, FOAF.Image])
}

export function isBookmarkedLink(thing) {
  return hasRDFTypes(thing, [MY.SKOS.Bookmark, MY.FOAF.Link])
}

export function isBookmarkedFile(thing) {
  return hasRDFTypes(thing, [MY.SKOS.Bookmark, MY.FOAF.File])
}
