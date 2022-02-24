import { namedNode, dataset } from "@rdfjs/dataset";
import type { DatasetCore } from "@rdfjs/types";
import {
  Thing,
  SolidDataset,
  createThing,
  buildThing,
  setThing,
  getThing,
  createSolidDataset,
} from "@inrupt/solid-client";
import { MY, MIME } from "../vocab";
import { SKOS, RDF, FOAF, DCTERMS } from '@inrupt/vocab-common-rdf';
import * as base58 from "micro-base58";

/*
Design:
This file is the model for the Index, formerly called the Concepts Index.

With the addition of Links and Images to the Index, it no longer behaves
exclusively as an Index for Concepts, though it does still deal primarily with
SKOS:Concepts.

For now, the Index file will still be serialized to
{Storage}/concepts.ttl to maintain simplicifty.

I am going to try something a bit experimental here, using existing ontologies
as much as possible rather than inventing our own.  This model file will try
storing and indexing data using the SKOS, DCTERMS, and FOAF ontologies.

An Image will be stored as a url with the FOAF.Image type.
A File will be stored as a url with the MY.FOAF.File type from the MY.FOAF extension.
A Link will be stored as a url with the MY.FOAF.Link type from the MY.FOAF extension.

SKOS:Concept can refer to unnamed things and a label can be set later. However,
unless the user has explicityly created an unnamed Concept, we should not create
one for them. Instead, use the MY.SKOS.Bookmark type from the MY.SKOS extension,
which is intended to represent Bookmarked resources that might eventually be
attached to a Concept, but are not yet.

An SKOS.Concept can be linked to a Bookmarked resource by using the associated
SKOS.note and FOAF.page properties. The semantics of both SKOS.note and FOAF.Document
specify that they can (and should) be used for all content, including Images.
Please rememember to add additional format information using DCTERMS.format.  As
reccomended by the DCTERMS documentation, we use mime types:
https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types</DCTERMS>
*/

// This is a temporary hack. We create a DatasetCore from a SolidDataset, and
// the Inrupt libraries seems to know what to do with it. So define this type to
// the TS happy. But this is a brittle assumption that may break later.
type SolidDatasetCore = SolidDataset & DatasetCore;

type OGTags = {
  ogTitle: string;
  ogDescription: string;
  ogImage: {
    url: string;
  };
  ogUrl: string;
};

export function addLinkToIndex(
  index: SolidDataset,
  url: string,
  og?: OGTags
): SolidDataset {
  url = (og && og.ogUrl) || url;
  const builder = buildThing(createThing({ url }))
    .addUrl(RDF.type, MY.SKOS.Bookmark)
    .addUrl(RDF.type, MY.FOAF.Link)
    .addDatetime(DCTERMS.modified, new Date())
    .addDatetime(DCTERMS.created, new Date());
  if (og) {
    if (og.ogImage && og.ogImage.url) {
      builder.addUrl(FOAF.depiction, og.ogImage.url)
    }
    if (og.ogTitle) {
      builder.addStringNoLocale(DCTERMS.title, og.ogTitle);
    }
    if (og.ogDescription) {
      builder.addStringNoLocale(DCTERMS.description, og.ogDescription);
    }
    }
  const LinkThing = builder.build();
  return setThing(index || createSolidDataset(), LinkThing);
}

export function addImageToIndex(
  index: SolidDataset,
  url: string,
  file: File
): SolidDataset {
  const ImageThing = buildThing(createThing({ url }))
    .addUrl(RDF.type, MY.SKOS.Bookmark)
    .addUrl(RDF.type, FOAF.Image)
    .addDatetime(DCTERMS.modified, new Date())
    .addDatetime(DCTERMS.created, new Date(file.lastModified))
    .addStringNoLocale(DCTERMS.title, file.name)
    .addStringNoLocale(DCTERMS.format, file.type)
    .build();

  return setThing(index || createSolidDataset(), ImageThing);
}

export function addFileToIndex(
  index: SolidDataset,
  url: string,
  file: File
): SolidDataset {
  const FileThing = buildThing(createThing({ url }))
    .addUrl(RDF.type, MY.SKOS.Bookmark)
    .addUrl(RDF.type, MY.FOAF.File)
    .addDatetime(DCTERMS.modified, new Date())
    .addDatetime(DCTERMS.created, new Date(file.lastModified))
    .addStringNoLocale(DCTERMS.title, file.name)
    .addStringNoLocale(DCTERMS.format, file.type)
    .build();

  return setThing(index || createSolidDataset(), FileThing);
}

export function _addTagToIndex(index: SolidDataset, tag: string): SolidDataset {
  const TagThing = buildThing(
    createThing({ name: `TAG:base58:${base58.encode(tag)}` })
  )
    //.addUrl(RDF.type, SKOS.Label)
    .addUrl(RDF.type, MY.SKOS.Tag)
    .addStringNoLocale(SKOS.prefLabel, tag)
    // TODO:     .addStringNoLocale(DCTERMS.format, ...)
    .build();

  return setThing(index || createSolidDataset(), TagThing);
}

export function _addMentionToIndex(
  index: SolidDataset,
  handle: string
): SolidDataset {
  const MentionThing = buildThing(
    createThing({ name: `MENTION:base58:${base58.encode(handle)}` })
  )
    //.addUrl(RDF.type, SKOS.Label)
    .addUrl(RDF.type, MY.SKOS.Mention)
    .addStringNoLocale(SKOS.prefLabel, handle)
    .build();

  return setThing(index || createSolidDataset(), MentionThing);
}

// DO NOT USE -- only a prototype for how we might store Contacts
function _addPersonToIndex(
  index: SolidDataset,
  handle: string,
  name: string
): SolidDataset {
  const PersonThing = buildThing(
    createThing({ name: `PERSON:base58:${base58.encode(handle)}` })
  )
    .addUrl(RDF.type, FOAF.Person)
    .addStringNoLocale(SKOS.prefLabel, handle)
    .addStringNoLocale(FOAF.nick, handle)
    .addStringNoLocale(FOAF.name, name)
    .build();

  return setThing(index || createSolidDataset(), PersonThing);
}

// DO NOT USE -- only a prototype for how we might use SKOS for collections
function _addConceptToIndex(index: SolidDataset, name: string) {
  const ConceptThing = buildThing(
    // NOTE: This will not work if we move the concept.
    createThing({ name: `CONCEPT:base58:${base58.encode(name)}` })
  )
    .addUrl(RDF.type, SKOS.Concept)
    .addStringNoLocale(SKOS.prefLabel, name)
    // .addUrl(SKOS.note, ...)
    .build();

  return setThing(index || createSolidDataset(), ConceptThing);
}

// DO NOT USE -- only a prototype for how we might uaw SKOS for Collections
function _addCollectionToIndex(index: SolidDataset, name: string) {
  const ConceptThing = buildThing(
    // NOTE: This will not work if we move the concept.
    createThing({ name: `COCNEPT:base58:${base58.encode(name)}` })
  )
    .addUrl(RDF.type, SKOS.Collection)
    .addStringNoLocale(SKOS.prefLabel, name)
    // .addUrl(SKOS.note, ...)
    .build();

  return setThing(index || createSolidDataset(), ConceptThing);
}
