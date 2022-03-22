import {
  createThing,
  getThing,
  getThingAll,
  getUrl,
  WebId,
  setThing,
  Thing,
  getUrlAll,
  buildThing,
  UrlString,
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
import { hasRDFType, slugToUrl } from './utils';
import { RDF } from '@inrupt/vocab-common-rdf';
import { MY } from './vocab';

export function getRootContainer(profile: Profile): Container {
  // TODO: What should we do if there is no storage set?
  return profile && getUrl(profile, WS.storage);
}

export function getSpacePreferencesFile(
  profile: Profile
): SpacePreferencesFile {
  return (
    profile &&
    (getUrl(profile, WS.preferencesFile) ||
      new URL('settings/prefs.ttl', getRootContainer(profile)).toString())
  );
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

export function createSpace(
  holder: WebId,
  container: Container,
  slug: Slug,
  gardenUrls: {
    private: UrlString;
    public: UrlString;
    nursery: UrlString;
    compost: UrlString;
  }
): Space {
  return buildThing(createThing({ name: slug }))
    .addUrl(MY.Garden.holder, holder)
    .addUrl(RDF.type, WS.Workspace)
    .addUrl(RDF.type, MY.Garden.Space)
    .addUrl(WS.storage, container)
    .addUrl(MY.Garden.imageStorage, new URL('images/', container).toString())
    .addUrl(MY.Garden.fileStorage, new URL('files/', container).toString())
    .addUrl(MY.Garden.noteStorage, new URL('notes/', container).toString())
    .addUrl(MY.Garden.hasGarden, gardenUrls.private)
    .addUrl(MY.Garden.hasGarden, gardenUrls.public)
    .addUrl(MY.Garden.hasNursery, gardenUrls.nursery)
    .addUrl(MY.Garden.hasCompost, gardenUrls.compost)
    .addUrl(
      MY.Garden.hasPublicationsManifest,
      new URL('publications.ttl', container).toString()
    )
    .addUrl(
      MY.Garden.hasGnomesManifest,
      new URL('gnomes.ttl', container).toString()
    )
    .build();
}

export const MetaSpaceSlug = 'spaces';
export const HomeSpaceSlug = 'home'
export function getMetaSpace(spaces: SpacePreferences): Space {
  return spaces && getSpace(spaces, MetaSpaceSlug);
}

export function setMetaSpace(
  spaces: SpacePreferences,
  space: Space
): SpacePreferences {
  spaces && spaces && console.assert(isMetaSpace(space));
  return spaces && space && setSpace(spaces, space);
}

export function hasRequiredSpaces(spaces: SpacePreferences): boolean {
  return spaces && getMetaSpace(spaces) && getSpaceAll(spaces).length >= 0;
}

export function createMetaSpace(holder: WebId, profile: Profile) {
  return buildThing(createThing({ name: MetaSpaceSlug }))
    .addUrl(MY.Garden.holder, holder)
    .addUrl(RDF.type, WS.MasterWorkspace)
    .addUrl(RDF.type, MY.Garden.MetaSpace)
    .addUrl(
      WS.storage,
      new URL('spaces/', getRootContainer(profile)).toString()
    )
    .build();
}