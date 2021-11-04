import { namedNode, dataset } from "@rdfjs/dataset";
import type { DatasetCore } from "@rdfjs/types";
import {
  Thing,
  SolidDataset,
  createThing,
  buildThing,
  setThing,
  getThing,
  asUrl,
  createSolidDataset,
} from '@inrupt/solid-client';
import { MY, SIOC } from "../vocab";
import { RDF, SKOS } from '@inrupt/vocab-common-rdf';
import * as base58 from "micro-base58";
import { v1 as uuid } from 'uuid';

/*
Design:

This file is the model for Newsletters and Editions.
A given Newsletter will have many Editions,
each specified by a volume and issue number.

*/

type IRI = string;
type WebId = IRI;

type Newsletter = {
  iri: IRI;
  title: string;
  author: string;
  editions: Edition[];
  distributionList: Subscriber[];
};

type Subscriber = {
  email: string;
};

type Concept = {
  iri: IRI;
};

type Collection = {
  iri: IRI;
};

enum HTMLTemplate {
  ConceptPage = "ConceptPage",
  CollectionPage = "CollectionPage",
} 

type ConceptPageConfig = {
  template: HTMLTemplate.ConceptPage
  concept: Concept
}

type CollectionPageConfig = {
  template: HTMLTemplate.CollectionPage
  concept: Concept,
  collection: Collection
}

type HTMLConfig = ConceptPageConfig | CollectionPageConfig 

type Edition = {
  iri: IRI;
  publicationIri: IRI;
  volume: number;
  issue: number;
  config: HTMLConfig
};

type EditionNo = {
  volume: number,
  issue: number
}

export function newsletterIdFromTitle(title: string) {
  return `newsletter:base58:${base58.encode(title)}`;
}

export function newNewsletter(
  dataset: SolidDataset,
  title: string
): SolidDataset {
  dataset = dataset || createSolidDataset();
  const thing = buildThing(createThing({ name: newsletterIdFromTitle(title) }))
    .addUrl(RDF.type, SIOC.Container)
    .addUrl(RDF.type, MY.SIOC.Newsletter)
    .build();
  return setThing(dataset, thing);
} 

export function userIdFromEmail(email: string) {
  return `user:base58:${base58.encode(email)}`; 
}

export function addSubscriberToNewsletter(
  dataset: SolidDataset,
  newsletter: Newsletter,
  email: string
): SolidDataset {
  dataset = dataset || createSolidDataset();
  const thing = buildThing(createThing({ name: userIdFromEmail(email) }))
    .addUrl(RDF.type, SIOC.User)
    .addUrl(SIOC.subscriber_of, newsletter.iri)
    .addStringNoLocale(SIOC.email, email)
    .build();
  return setThing(dataset, thing);
}

export function editionId(newsletter: Newsletter, no: EditionNo) {
  const newsletterId = newsletterIdFromTitle(newsletter.title);
  return  `${newsletterId}:${no.volume}:${no.issue}`;
}

export function nextEditionNo(newsletter: Newsletter): EditionNo {
  return {
    volume: 1,
    issue: newsletter.editions.length + 1
  }
}

export function currentEditionNo(newsletter: Newsletter): EditionNo {
  return {
    volume: 1,
    // starts at 1.  0 if there are no editions yet
    issue: newsletter.editions.length,
  };
}

export function currentEditionId(newsletter: Newsletter) {
  return editionId(newsletter, currentEditionNo(newsletter));
}

export function nextEditionId(newsletter: Newsletter) {
  return editionId(newsletter, nextEditionNo(newsletter));
}

export function htmlConfigId() {
  return `html_config:uuid:${uuid()}`;
}

export function newConceptPageConfigThing(concept: Concept): Thing {
  return buildThing(createThing({ name: htmlConfigId() }))
    .addUrl(RDF.type, MY.HTML.Config)
    .addUrl(MY.HTML.uses_template, HTMLTemplate.ConceptPage)
    .addUrl(MY.HTML.uses_concept, concept.iri)
    .build();
}

export function newCollectionPageConfigThing(
  concept: Concept,
  collection: Collection
): Thing {
  return buildThing(createThing({ name: htmlConfigId() }))
    .addUrl(RDF.type, MY.HTML.Config)
    .addUrl(MY.HTML.uses_template, HTMLTemplate.CollectionPage)
    .addUrl(MY.HTML.uses_collection, collection.iri)
    .addUrl(MY.HTML.uses_concept, concept.iri)
    .build();
}

export function newEdition(
  index: SolidDataset,
  newsletter: Newsletter,
  concept: Concept,
  collection?: Collection
): SolidDataset {
  const HTMLConfig = collection
    ? newCollectionPageConfigThing(concept, collection)
    : newConceptPageConfigThing(concept);
  index = setThing(index || createSolidDataset(), HTMLConfig);

  const Edition = buildThing(createThing({ name: nextEditionId(newsletter) }))
    .addUrl(RDF.type, SIOC.Item)
    .addUrl(RDF.type, MY.News.Edition)
    .addUrl(SIOC.has_container, newsletter.iri)
    .addUrl(SIOC.edition_of, newsletter.iri)
    .addUrl(MY.HTML.configured_by, asUrl(HTMLConfig))
    .build();

  return setThing(index, Edition);
}

export function publishEdition() {}

export function deliverEdition() {}

export function publishAndDeliver() {}