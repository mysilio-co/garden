import {
  Garden,
  GardenFile,
  GardenItem,
  Space,
  UUID,
  SpacePreferences,
  Slug,
  AppSettings,
  GardenConfig,
} from './types';
import {
  getItemWithTitle,
  getItemWithUUID,
  ensureGardenConfig,
  getConfig,
} from './garden';
import {
  asUrl,
  WebId,
  createSolidDataset,
  UrlString,
  access,
  getSourceUrl,
} from '@inrupt/solid-client';
import {
  useProfile,
  useResource,
  useThing,
  ResourceResult,
  ThingResult,
  usePublicAccess,
} from 'swrlit';
import {
  createMetaSpace,
  createSpace,
  MetaSpaceSlug,
  getContainer,
  getMetaSpace,
  getSpace,
  getSpaceAll,
  getSpacePreferencesFile,
  hasRequiredSpaces,
  HomeSpaceSlug,
  setMetaSpace,
  setSpace,
} from './spaces';
import { appSettingsUrl } from './settings';

export type GardenResult = ResourceResult & {
  garden: Garden;
  saveGarden: any;
  config: GardenConfig;
};
export type GardenWithPublicAccessResult = GardenResult & {
  publicAccess: access.Access;
  savePublicAccess: any;
};
export type GardenWithSetupResult = GardenWithPublicAccessResult & {
  setupGarden: any;
};
export type FilteredGardenResult = { garden: Garden };
export type GardenItemResult = ThingResult & {
  item: GardenItem;
  saveToGarden: any;
};
export type SpaceResult = ThingResult & { space: Space; saveSpace: any };
export type SpaceWithSetupResult = SpaceResult & {
  setupSpace: any;
};
export type SpacePreferencesResult = ResourceResult & {
  spaces: SpacePreferences;
  saveSpaces: any;
};
export type SpacePreferencesWithSetupResult = SpacePreferencesResult & {
  setupDefaultSpaces: any;
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
  const ensured = ensureGardenConfig(res.resource);
  const config = getConfig(ensured)
  res.garden = ensured;
  res.config = config;
  res.resource = ensured;
  res.saveGarden = res.save;
  return res;
}

export function useGardenWithPublicAccess(
  index: GardenFile
): GardenWithPublicAccessResult {
  const res = useGarden(index) as GardenWithPublicAccessResult;
  const { access, saveAccess } = usePublicAccess(index);
  res.publicAccess = access;
  res.savePublicAccess = saveAccess;
  return res;
}

export function useGardenWithSetup(
  index: GardenFile,
  publicRead?: boolean
): GardenWithSetupResult {
  const res = useGardenWithPublicAccess(index) as GardenWithSetupResult;
  const setup =
    res.error && res.error.statusCode === 404
      ? undefined
      : async () => {
          await res.saveGarden(res.garden);
          await res.savePublicAccess({ read: publicRead });
        };
  res.setupGarden = setup;
  return res;
}

export function useSpace(spaces: SpacePreferences, slug: Slug): SpaceResult {
  const space = getSpace(spaces, slug);
  const res = useThing(asUrl(space)) as SpaceResult;
  res.space = res.thing;
  res.saveSpace = res.save;
  return res;
}

export function useSpaceWithSetup(
  spaces: SpacePreferences,
  slug: Slug,
  webId: WebId
): SpaceWithSetupResult {
  const res = useSpace(spaces, slug) as SpaceWithSetupResult;
  const metaspace = getContainer(getMetaSpace(spaces));
  const container = new URL(`${slug}/`, metaspace).toString();
  const publicGardenUrl = new URL('private.ttl', container).toString()
  const privateGardenUrl = new URL('public.ttl', container).toString()
  const nurseryUrl = new URL('nursery.ttl', container).toString()
  const compostUrl = new URL('compost.ttl', container).toString()
  const publicGarden = useGardenWithSetup(publicGardenUrl);
  const privateGarden = useGardenWithSetup(privateGardenUrl, true);
  const nursery = useGardenWithSetup(nurseryUrl);
  const compost = useGardenWithSetup(compostUrl);
  const setup = getSpace(spaces, slug)
    ? undefined
    : async () => {
      await publicGarden.setupGarden()
      await privateGarden.setupGarden()
      await compost.setupGarden()
      await nursery.setupGarden()
        await res.saveSpace(
          spaces,
          createSpace(webId, container, HomeSpaceSlug, {
            compost: compostUrl,
            nursery: nurseryUrl,
            private: privateGardenUrl,
            public: publicGardenUrl,
          })
        );
      };
  res.setupSpace = setup;
  return res;
}

export function useMetaSpace(spaces: SpacePreferences): SpaceResult {
  return useSpace(spaces, MetaSpaceSlug);
}

export function useMetaSpaceWithSetup(
  spaces: SpacePreferences,
  webId: WebId
): SpaceWithSetupResult {
  const res = useMetaSpace(spaces) as SpaceWithSetupResult;
  const { profile } = useProfile(webId);
  const setup = getMetaSpace(spaces)
    ? undefined
    : async () => {
        await res.saveSpace(
          setMetaSpace(spaces, createMetaSpace(webId, profile))
        );
      };
  res.setupSpace = setup;
  return res;
}

export function useSpaces(webId: WebId): SpacePreferencesResult {
  const { profile } = useProfile(webId);
  const res = useOrCreateResource(
    getSpacePreferencesFile(profile)
  ) as SpacePreferencesResult;
  res.spaces = res.resource;
  res.saveSpaces = res.save;
  return res;
}

export function useSpacesWithSetup(
  webId: WebId
): SpacePreferencesWithSetupResult {
  const res = useSpaces(webId) as SpacePreferencesWithSetupResult;
  const meta = useMetaSpaceWithSetup(res.spaces, webId);
  const home = useSpaceWithSetup(res.spaces, HomeSpaceSlug, webId);
  const setup = hasRequiredSpaces(res.spaces)
    ? undefined
    : async () => {
        if (!getMetaSpace(res.spaces)) {
          await meta.setupSpace();
        }
        if (getSpaceAll(res.spaces).length <= 0) {
          await home.setupSpace();
        }
      };
  res.setupDefaultSpaces = setup
  return res;
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