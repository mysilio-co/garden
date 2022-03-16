import {
  createThing,
  getThing,
  getThingAll,
  getUrl,
  WebId,
  setThing,
  Thing,
  getUrlAll,
} from '@inrupt/solid-client';
import {
  Profile,
  Container,
  SpacePreferencesFile,
  SpacePreferences,
  Space,
  Slug,
  GardenFile,
} from './types';
import { WS } from '@inrupt/vocab-solid-common';
import { ensureUrl, hasRDFType, slugToUrl } from './utils';
import { RDF } from '@inrupt/vocab-common-rdf';
import { MY } from './vocab';

export function getRootContainer(profile: Profile): Container {
  return profile && getUrl(profile, WS.storage);
}

export function getSpacePreferencesFile(profile: Profile): SpacePreferencesFile {
  return profile && getUrl(profile, WS.preferencesFile);
}

export function getContainer(space: Space): Container {
  return space && getUrl(space, WS.storage);
}

export function getPrivateGardenFileAll(space: Space): GardenFile[] {
  return space && getUrlAll(space, MY.Garden.hasPrivateGarden);
}

export function getPublicGardenFileAll(space: Space): GardenFile[] {
  return space && getUrlAll(space, MY.Garden.hasPublicGarden);
}

export function getCompostFile(space: Space): GardenFile {
  return space && getUrl(space, MY.Garden.hasCompost);
}

export function getNurseryFile(space: Space): GardenFile {
  return space && getUrl(space, MY.Garden.hasNursery);
}

export function getSpaceAll(spaces: SpacePreferences): Space[] {
  return spaces && getThingAll(spaces).filter(isSpace);
}

export function isSpace(thing: Thing): boolean {
  return thing && hasRDFType(thing, MY.Garden.Space);
}

export function isMetaSpace(thing: Thing): boolean {
  return thing && hasRDFType(thing, MY.Garden.MetaSpace);
}

export function getSpace(spaces: SpacePreferences, slug: Slug): Space {
  return spaces && getThing(spaces, slugToUrl(spaces, slug));
}

export function setSpace(
  spaces: SpacePreferences,
  space: Space
): SpacePreferences {
  return spaces && space && setThing(spaces, space);
}

function ensureManifests(space: Space): Space {
  const container = getContainer(space);
  space = ensureUrl(
    space,
    MY.Garden.hasPublicationsManifest,
    new URL(container, 'publications.ttl').toString()
  );
  space = ensureUrl(
    space,
    MY.Garden.hasGnomesManifest,
    new URL(container, 'gnomes.ttl').toString()
  );
  return space;
}

function ensureStorage(space: Space): Space {
  const container = getContainer(space);
  space = ensureUrl(
    space,
    MY.Garden.imageStorage,
    new URL(container, 'images/').toString()
  );
  space = ensureUrl(
    space,
    MY.Garden.fileStorage,
    new URL(container, 'files/').toString()
  );
  space = ensureUrl(
    space,
    MY.Garden.noteStorage,
    new URL(container, 'notes/').toString()
  );
  return space;
}

function ensureGardens(space: Space): Space {
  const container = getContainer(space);
  space = ensureUrl(
    space,
    MY.Garden.hasPrivateGarden,
    new URL(container, 'private.ttl').toString()
  );
  space = ensureUrl(
    space,
    MY.Garden.hasPublicGarden,
    new URL(container, 'public.ttl').toString()
  );
  space = ensureUrl(
    space,
    MY.Garden.hasNursery,
    new URL(container, 'nursery.ttl').toString()
  );
  space = ensureUrl(
    space,
    MY.Garden.hasCompost,
    new URL(container, 'compost.ttl').toString()
  );
  return space;
}

function ensureSpace(
  spaces: SpacePreferences,
  holder: WebId,
  parent: Container,
  slug: Slug
): SpacePreferences {
  const container = new URL(parent, `${slug}/`).toString();
  let space = getSpace(spaces, slug) || createThing({ name: slug });
  space = ensureUrl(space, MY.Garden.holder, holder);
  space = ensureUrl(space, RDF.type, WS.Workspace);
  space = ensureUrl(space, RDF.type, MY.Garden.Space);
  space = ensureUrl(space, WS.storage, container);
  // need to happen after storage is set
  space = ensureStorage(space);
  space = ensureGardens(space);
  space = ensureManifests(space);
  return setSpace(spaces, space);
}

const DefaultMetaSpaceName = 'spaces';
export function getMetaSpace(spaces: SpacePreferences): Space {
  return spaces && getThing(spaces, DefaultMetaSpaceName);
}

export function setMetaSpace(
  spaces: SpacePreferences,
  space: Space
): SpacePreferences {
  console.assert(isMetaSpace(space));
  return setSpace(spaces, space);
}

function ensureMetaSpace(
  spaces: SpacePreferences,
  holder: WebId,
  rootContainer: Container
): SpacePreferences {
  let space =
    getMetaSpace(spaces) || createThing({ name: DefaultMetaSpaceName });
  space = ensureUrl(space, MY.Garden.holder, holder);
  space = ensureUrl(space, RDF.type, WS.MasterWorkspace);
  space = ensureUrl(space, RDF.type, MY.Garden.MetaSpace);
  space = ensureUrl(
    space,
    WS.storage,
    new URL(rootContainer, 'spaces/').toString()
  );
  return setMetaSpace(spaces, space);
}

const HomeSpaceName = 'home'
function ensureHomeSpace(
  spaces: SpacePreferences,
  holder: WebId
): SpacePreferences {
  if (getSpaceAll(spaces).length === 0) {
    const metaspace = getContainer(getMetaSpace(spaces));
    spaces = ensureSpace(spaces, holder, metaspace, HomeSpaceName);
  }
  return spaces;
};

export function ensureDefaultSpaces(
  holder: WebId,
  rootContainer: Container,
  spaces: SpacePreferences
): SpacePreferences {
  // meta space must come first, other spaces rely on it
  spaces = ensureMetaSpace(spaces, holder, rootContainer);
  spaces = ensureHomeSpace(spaces, holder);
  return spaces;
}