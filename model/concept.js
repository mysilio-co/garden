import { US } from "../vocab";
import { namedNode } from "@rdfjs/dataset";
import {
  createThing,
  addUrl,
  setThing,
  createSolidDataset,
  setDatetime,
  getDatetime,
  getUrl,
  setUrl,
  getUrlAll
} from "@inrupt/solid-client";
import { FOAF, DCTERMS } from "@inrupt/vocab-common-rdf";
import {
  getConceptNodes,
  getConceptNameFromNode,
  getTagNodes,
  getTagNameFromNode,
} from "../utils/slate";
import {
  conceptNameToUrlSafeId,
  urlSafeIdToConceptName,
  tagNameToUrlSafeId,
} from "../utils/uris";
import { defaultNoteStorageUri } from "./note";

export function conceptIdFromUri(uri) {
  return uri.substring(uri.lastIndexOf("#") + 1);
}

export function conceptNameFromUri(uri) {
  return urlSafeIdToConceptName(conceptIdFromUri(uri));
}

export function conceptUrisThatReference(index, conceptUri) {
  return Array.from(
    index.match(null, namedNode(US.refersTo), namedNode(conceptUri))
  ).map(({ subject }) => subject.value);
}

export function conceptUrisTaggedWith(index, tagUri) {
  return Array.from(
    index.match(null, namedNode(US.tagged), namedNode(tagUri))
  ).map(({ subject }) => subject.value);
}

function createConcept(prefix, name) {
  return createThing({ url: `${prefix}${conceptNameToUrlSafeId(name)}` });
}

function createTag(prefix, name) {
  return createThing({ url: `${prefix}${tagNameToUrlSafeId(name)}` });
}

export function createConceptFor(
  name,
  conceptPrefix,
  conceptNames,
  tagPrefix,
  tagNames
) {
  let concept = createConcept(conceptPrefix, name);
  for (const conceptName of conceptNames) {
    concept = addUrl(
      concept,
      US.refersTo,
      createConcept(conceptPrefix, conceptName)
    );
  }
  for (const tagName of tagNames) {
    concept = addUrl(concept, US.tagged, createTag(tagPrefix, tagName));
  }
  return concept;
}

export function createOrUpdateConceptIndex(
  newNoteValue,
  workspace,
  conceptIndex,
  concept,
  name
) {
  const conceptPrefix = getUrl(workspace, US.conceptPrefix);
  const tagPrefix = getUrl(workspace, US.tagPrefix);
  const storageUri = concept
    ? getUrl(concept, US.storedAt)
    : defaultNoteStorageUri(workspace, name);

  const newNoteValueNode = { children: newNoteValue }
  const conceptNames = getConceptNodes(newNoteValueNode).map(([concept]) =>
    getConceptNameFromNode(concept)
  );

  const tagNames = getTagNodes(newNoteValueNode).map(([tag]) => getTagNameFromNode(tag));
  const created = getDatetime(concept, DCTERMS.created) || new Date();
  let newConcept = createConceptFor(
    name,
    conceptPrefix,
    conceptNames,
    tagPrefix,
    tagNames
  );
  newConcept = addUrl(newConcept, US.storedAt, storageUri);
  newConcept = setDatetime(newConcept, DCTERMS.modified, new Date());
  newConcept = setDatetime(newConcept, DCTERMS.created, created);
  const img = concept && getUrl(concept, FOAF.img);
  if (img) {
    newConcept = setUrl(newConcept, FOAF.img, getUrl(concept, FOAF.img));
  }
  // TODO: right now this destroys anything that currently exists on the concept, so any time we add
  // anything to the concept data model we need to be sure to manually copy it over here. this feels wrong
  // so let's figure out a more coherent model for all of this.
  return setThing(conceptIndex || createSolidDataset(), newConcept);
}

export function getTags(concept) {
  return getUrlAll(concept, US.tagged)
}

export function tagUrlToTagName(tagUrl, tagPrefix) {
  return tagUrl.split(tagPrefix)[1]
}

export function getLinks(concept) {
  return getUrlAll(concept, US.refersTo)
}

export function conceptUrlToConceptName(conceptUrl, conceptPrefix) {
  return urlSafeIdToConceptName(conceptUrl.split(conceptPrefix)[1])
}

export function createExampleConcept(name, conceptPrefix) {
  let concept = createConcept(conceptPrefix, name);

  concept = setDatetime(concept, DCTERMS.created, new Date());
  concept = setDatetime(concept, DCTERMS.modified, new Date());
  return concept
}

export function hasNote(concept) {
  return !!getUrl(concept, US.storedAt);
}