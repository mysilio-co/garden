import {
  buildThing,
  createThing,
  getThing,
  getThingAll,
  getUrl,
  WebId,
  setThing,
  Thing
} from '@inrupt/solid-client';
import {
  Profile,
  Container,
  SpacePreferencesFile,
  SpacePreferences,
  Space,
  Slug,
} from './types';
import { WS } from '@inrupt/vocab-solid-common';
import { hasRDFType, slugToUrl } from './utils';
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


export function createSpace(
  holder: WebId,
  container: Container,
  slug: Slug
): Space {
  return buildThing(createThing({ name: slug }))
    .addUrl(MY.Garden.holder, holder)
    .addUrl(RDF.type, WS.Workspace)
    .addUrl(RDF.type, MY.Garden.Space)
    .addUrl(WS.storage, container)
    .addUrl(MY.Garden.imageStorage, new URL(container, 'images/').toString())
    .addUrl(MY.Garden.fileStorage, new URL(container, 'files/').toString())
    .addUrl(MY.Garden.noteStorage, new URL(container, 'notes/').toString())
    .build();
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
      .addUrl(WS.storage, new URL(rootContainer, 'spaces/').toString())
      .build()
  );
}

const DefaultSpaceName = 'default'
export function ensureDefaultSpaces(
  holder: WebId,
  rootContainer: Container,
  spaces: SpacePreferences
): SpacePreferences {
  if (!getMetaSpace(spaces)) {
    spaces = setMetaSpace(spaces, createMetaSpace(holder, rootContainer));
  }
  if (getSpaceAll(spaces).length === 0) {
    const metaspace = getContainer(getMetaSpace(spaces));
    const defaultSpace = createSpace(holder, metaspace, DefaultSpaceName);
    spaces = setSpace(spaces, defaultSpace);
  }
  return spaces;
}