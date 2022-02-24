import {
  buildThing,
  createThing,
  getSourceUrl,
  getThing,
  getUrl,
  IriString,
  WebId,
  toRdfJsDataset,
} from '@inrupt/solid-client';
import {
  Profile,
  Container,
  SpacePreferencesFile,
  SpacePreferences,
  Space,
} from './types';
import { WS } from '@inrupt/vocab-solid-common';
import { base58Urn } from './utils';
import { RDF } from '@inrupt/vocab-common-rdf';
import { MY } from './vocab';
import { namedNode } from "@rdfjs/dataset";

function getRootContainer(profile: Profile): Container {
  return profile && getUrl(profile, WS.storage);
}

function getSpacePreferencesFile(profile: Profile): SpacePreferencesFile {
  return profile && getUrl(profile, WS.preferencesFile);
}

export function getSpaceAll(spaces: SpacePreferences): Space[] {}

export function getSpaceWithTitle(spaces: SpacePreferences, title: string) {
  return getSpace(spaces, base58Urn(title));
}

const DefaultMetaSpaceName = 'spaces';
export function ensureMetaSpace(
  spaces: SpacePreferences,
  holder?: WebId,
  rootContainer?: Container
): Space {
  const dataset = spaces && toRdfJsDataset(spaces);
  const metaSpaceUrls =
    dataset &&
    Array.from(
      dataset.match(null, namedNode(RDF.type), MY.Garden.MetaSpace)
    ).map(({ subject }) => subject.value);

  if (metaSpaceUrls.length < 1) {
    return holder && rootContainer && createMetaSpace(holder, rootContainer);
  } else {
    if (metaSpaceUrls.length > 1) {
      console.error('More that one MetaSpace found: ', getSourceUrl(spaces));
    }
  return metaSpaceUrls && getThing(spaces, metaSpaceUrls[0]);
  }
}

export function setSpace(
  spaces: SpacePreferences,
  name: string,
  space: Space
): SpacePreferences {}

export function createMetaSpace(
  holder: WebId,
  rootContainer: Container
): Space {
  return (
    rootContainer &&
    buildThing(createThing({ name: DefaultMetaSpaceName }))
      .addUrl(MY.Garden.holder, holder)
      .addUrl(RDF.type, WS.MasterWorkspace)
      .addUrl(RDF.type, MY.Garden.MetaSpace)
      .addUrl(WS.storage, `${rootContainer}${DefaultMetaSpaceName}/`)
      .build()
  );
}

export function createSpace(
  holder: WebId,
  container: Container,
  name: string
): Space {
  return buildThing(createThing({ name }))
    .addUrl(MY.Garden.holder, holder)
    .addUrl(RDF.type, WS.Workspace)
    .addUrl(RDF.type, MY.Garden.Space)
    .addUrl(WS.storage, container)
    .addUrl(MY.Garden.imageStorage, `${container}images/`)
    .addUrl(MY.Garden.fileStorage, `${container}files/`)
    .addUrl(MY.Garden.noteStorage, `${container}noteStorage/`)
    .build();
}
