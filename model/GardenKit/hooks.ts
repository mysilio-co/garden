import {
  Garden,
  GardenFile,
  GardenItem,
  Space,
  UUID,
  SpacePreferences,
  Slug,
  AppSettings,
  Profile
} from './types';
import { getItemWithTitle, getItemWithUUID, createNewGarden } from './garden';
import { asUrl, WebId } from '@inrupt/solid-client';
import { useProfile, useResource, useThing } from 'swrlit';
import { createNewSpacePreferences, getMetaSpace, getRootContainer, getSpace, getSpacePreferencesFile } from "./spaces";

export type GardenResult = { garden: Garden; saveGarden: any };
export type FilteredGardenResult = { garden: Garden };
export type GardenItemResult = { item: GardenItem; saveToGarden: any };
export type SpaceResult = { space: Space; saveSpace: any };
export type SpacePreferencesResult = {
  spaces: SpacePreferences;
  saveSpaces: any;
};
export type AppSettingsResult = {
  settings: AppSettings;
  saveSettings: any;
};
export type GardenFilter = {
  // right now, we only support search based filtering
  // but leave room for additional filter criteria later.
  search: string;
};

export function useGardenItem(
  garden: Garden,
  uuid: UUID
): GardenItemResult {
  const item = getItemWithUUID(garden, uuid);
  const res = useThing(asUrl(item))
  res.item = res.thing;
  res.saveToGarden = res.saveThing;
  return res;
}

export function useTitledGardenIten(
  garden: Garden,
  name: string
): GardenItemResult {
  const item = getItemWithTitle(garden, name);
  const res = useThing(asUrl(item))
  res.item = res.thing
  res.saveToGarden = res.saveThing
  return res;
}

export function useFilteredGarden(
  index: GardenFile,
  filter: GardenFilter
): FilteredGardenResult {
  // call use garden
  const { garden } = useGarden(index);
  // filter with Fuse
  return {
    garden,
  };
}

export function useSpace(spaces: SpacePreferences, slug: Slug): SpaceResult {
  const space = getSpace(spaces, slug);
  const res = useThing(asUrl(space));
  res.space = res.thing;
  res.saveSpace = res.saveThing;
  return res;
};

export function useMetaSpace(spaces: SpacePreferences): SpaceResult {
  const meta = getMetaSpace(spaces);
  const res = useThing(asUrl(meta));
  res.space = res.thing;
  res.saveSpace = res.saveThing;
  return res;
};

export function useSpaces(webId: WebId): SpacePreferencesResult {
  const { profile } = useProfile(webId);
  const res = useResource(getSpacePreferencesFile(profile));
  if (res.error && res.error.statusCode === 404) {
    const newSpaces = createNewSpacePreferences();
    res.spaces = newSpaces;
    res.resource = newSpaces;
  } else {
    res.spaces = res.resource;
  }
  res.saveSpaces = res.saveResource;
  return res;
}

function appSettingsUrl(profile: Profile, namespace: Slug, name: Slug) {
  const base = getRootContainer(profile);
  const path = `/settings/${namespace}.ttl#${name}`;
  return new URL(base, path).toString();
}

export function useAppSettings(
  webId: WebId,
  appNamespace: Slug,
  appName: Slug
): AppSettingsResult {
  const { profile } = useProfile(webId);
  const res = useThing(appSettingsUrl(profile, appNamespace, appName));
  res.settings = res.thing
  res.saveSettings = res.saveThing
  return res;
}

export function useGarden(index: GardenFile): GardenResult {
  const res = useResource(index);
  if (res.error && res.error.statusCode === 404) {
    const newGarden = createNewGarden();
    res.garden = newGarden;
    res.resource = newGarden;
  } else {
    res.garden = res.resource;
  }
  res.saveGarden = res.saveResource;
  return res;
}
