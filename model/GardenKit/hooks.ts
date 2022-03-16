import {
  Garden,
  GardenFile,
  GardenItem,
  Space,
  UUID,
  SpacePreferences,
  Slug,
  AppSettings,
  Profile,
} from './types';
import { getItemWithTitle, getItemWithUUID, ensureGarden } from './garden';
import {
  asUrl,
  WebId,
  createSolidDataset,
  UrlString,
} from '@inrupt/solid-client';
import {
  useProfile,
  useResource,
  useThing,
  ResourceResult,
  ThingResult,
} from 'swrlit';
import {
  ensureDefaultSpaces,
  getMetaSpace,
  getRootContainer,
  getSpace,
  getSpacePreferencesFile,
} from './spaces';

export type GardenResult = ResourceResult & { garden: Garden; saveGarden: any };
export type FilteredGardenResult = { garden: Garden };
export type GardenItemResult = ThingResult & {
  item: GardenItem;
  saveToGarden: any;
};
export type SpaceResult = ThingResult & { space: Space; saveSpace: any };
export type SpacePreferencesResult = ResourceResult & {
  spaces: SpacePreferences;
  saveSpaces: any;
};
export type AppSettingsResult = ThingResult & {
  settings: AppSettings;
  saveSettings: any;
};
export type GardenFilter = {
  // right now, we only support search based filtering
  // but leave room for additional filter criteria later.
  search: string;
};

export function useGardenItem(garden: Garden, uuid: UUID): GardenItemResult {
  const item = getItemWithUUID(garden, uuid);
  const res = useThing(asUrl(item)) as GardenItemResult;
  res.item = res.thing;
  res.saveToGarden = res.save;
  return res;
}

export function useTitledGardenIten(
  garden: Garden,
  name: string
): GardenItemResult {
  const item = getItemWithTitle(garden, name);
  const res = useThing(asUrl(item)) as GardenItemResult;
  res.item = res.thing;
  res.saveToGarden = res.save;
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

export function useOrCreateResource(url: UrlString): ResourceResult {
  const response = useResource(url);
  const { error } = response;
  if (error && error.statusCode === 404) {
    const emptyResource = createSolidDataset();
    response.resource = emptyResource;
    return response;
  } else {
    return response;
  }
}

export function useGarden(index: GardenFile): GardenResult {
  const res = useOrCreateResource(index) as GardenResult;
  const ensured = ensureGarden(res.resource);
  res.garden = ensured;
  res.resource = ensured;
  res.saveGarden = res.save;
  return res;
}

export function useSpace(spaces: SpacePreferences, slug: Slug): SpaceResult {
  const space = getSpace(spaces, slug);
  const res = useThing(asUrl(space)) as SpaceResult;
  res.space = res.thing;
  res.saveSpace = res.save;
  return res;
}

export function useMetaSpace(spaces: SpacePreferences): SpaceResult {
  const meta = getMetaSpace(spaces);
  const res = useThing(asUrl(meta)) as SpaceResult;
  res.space = res.thing;
  res.saveSpace = res.save;
  return res;
}

export function useSpaces(webId: WebId): SpacePreferencesResult {
  const { profile } = useProfile(webId);
  const res = useOrCreateResource(
    getSpacePreferencesFile(profile)
  ) as SpacePreferencesResult;
  const ensured = ensureDefaultSpaces(
    webId,
    getRootContainer(profile),
    res.resource
  );
  res.spaces = ensured;
  res.resource = ensured;
  res.saveSpaces = res.save;
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
  const res = useThing(
    appSettingsUrl(profile, appNamespace, appName)
  ) as AppSettingsResult;
  res.settings = res.thing;
  res.saveSettings = res.save;
  return res;
}