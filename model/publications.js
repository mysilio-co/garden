import {
  buildThing,
} from '@inrupt/solid-client/thing/build';
import {
  setThing,
  getThingAll,
} from '@inrupt/solid-client/thing/thing';
import {
  createSolidDataset,
} from '@inrupt/solid-client/resource/solidDataset';
import {
  getStringNoLocale,
} from '@inrupt/solid-client/thing/get';

import { IRI, UUID, getUUID, createThingWithUUID, hasRDFType } from '../utils/rdf';
import { MY, SIOC } from "../vocab";
import { RDF, SKOS, DCTERMS, OWL} from '@inrupt/vocab-common-rdf';


/*
Design:

This file is the model for Newsletters and Editions.
A given Newsletter will have many Editions,
each specified by a volume and issue number.

*/

export function createNewsletter(title) {
  return buildThing(createThingWithUUID())
    .addUrl(RDF.type, SIOC.Container)
    .addUrl(RDF.type, MY.News.Newsletter)
    .addStringNoLocale(DCTERMS.title, title)
    .build();
}

export function addNewsletter(
  manifest,
  title,
) {
  return setThing(manifest || createSolidDataset(), createNewsletter(title));
}

export function getNewsletter(manifest, title) {
  return (
    manifest &&
    getThingAll(manifest)
      .filter((t) => {
        return hasRDFType(t, MY.News.Newsletter);
      })
      .find((t) => {
        return title === getStringNoLocale(t, DCTERMS.title);
      })
  );
}

export function createSubscriber(newsletter, info) {
  return buildThing(createThingWithUUID())
    .addUrl(RDF.type, SIOC.User)
    .addUrl(SIOC.subscriber_of, getUUID(newsletter))
    .addStringNoLocale(SIOC.email, info.email)
    .build();
}

export function getSubscribers(
  manifest,
  newsletter
) {
  return getThingAll(manifest).filter((t) => {
    hasRDFType(t, SIOC.User) &&
      getUUID(newsletter) === getStringNoLocale(t, SIOC.subscriber_of);
  });
}

// use private datasets only
export function addSubscriberToNewsletter(
  manifest,
  newsletter,
  subscriber,
) {
  return setThing(
    manifest || createSolidDataset(),
    createSubscriber(newsletter, subscriber)
  );
}

export function addSubcribersToNewsletter(
  manifest,
  newsletter,
  subscribers
) {
  manifest = manifest || createSolidDataset();
  for (const sub of subscribers) {
    manifest = addSubscriberToNewsletter(manifest, newsletter, sub)
  }
  return manifest
}

export function addNewsletterWithSubscribers(
  manifest,
  title,
  subscribers
) {
  const newsletter = createNewsletter(title);
  manifest = setThing(manifest || createSolidDataset(), newsletter);
  manifest = addSubcribersToNewsletter(manifest, newsletter, subscribers);
  return manifest;
}

function newConceptPageConfigThing(concept) {
  return buildThing(createThingWithUUID())
    .addUrl(RDF.type, MY.HTML.Config)
    .addUrl(MY.HTML.uses_template, HTMLTemplate.ConceptPage)
    .addUrl(MY.HTML.uses_concept, getUUID(concept))
    .build();
}

function newCollectionPageConfigThing(
  concept,
  collection
) {
  return buildThing(createThingWithUUID())
    .addUrl(RDF.type, MY.HTML.Config)
    .addUrl(MY.HTML.uses_template, HTMLTemplate.CollectionPage)
    .addUrl(MY.HTML.uses_collection, getUUID(collection))
    .addUrl(MY.HTML.uses_concept, getUUID(concept))
    .build();
}

export function newEdition(
  manifest,
  newsletter,
  concept,
  collection
) {
  const HTMLConfig = collection
    ? newCollectionPageConfigThing(concept, collection)
    : newConceptPageConfigThing(concept);
  manifest = setThing(manifest || createSolidDataset(), HTMLConfig);

  const Edition = buildThing(createThingWithUUID())
    .addUrl(RDF.type, SIOC.Item)
    .addUrl(RDF.type, MY.News.Edition)
    .addUrl(SIOC.has_container, getUUID(newsletter))
    .addUrl(SIOC.edition_of, getUUID(newsletter))
    .addUrl(MY.HTML.configured_by, getUUID(HTMLConfig))
    .build();

  return setThing(manifest, Edition);
}

export function newConceptPage() {}
export function newCollectionPage() {}
export function newLinkPage() {}

export function publishPage() {}
export function publishEdition() {}
export function deliverEdition() {}
export function publishAndDeliver() {}