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
  ensureGardenConfig,
  getConfig,
} from './garden';
import {
  WebId,
  createSolidDataset,
  UrlString,
  access,
  Thing,
  getSourceUrl,
} from '@inrupt/solid-client';
import {
  useProfile,
  useResource,
  useThing,
  ResourceResult,
  ThingResult,
  usePublicAccess,
  useThingInResource,
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
} from './spaces';
import { appSettingsUrl } from './settings';
import {
  asUrlString,
  createPtr,
  encodeBase58Slug,
  getUUID,
  slugToUrl,
  uuidUrn,
} from './utils';
import { useCallback } from 'react';

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

export function useGardenItem(index: GardenFile, uuid: UUID): GardenItemResult {
  const res = useThingInResource(index, asUrlString(uuid)) as GardenItemResult;
  res.item = res.thing;
  res.saveToGarden = res.save;
  return res;
}

export function useTitledGardenIten(
  index: GardenFile,
  title: string
): GardenItemResult {
  const slug = encodeBase58Slug(title);
  const ptr = useThing(slugToUrl(index, slug));
  const uuid = (index && getUUID(ptr.thing)) || uuidUrn();
  const res = useGardenItem(index, uuid);
  res.saveToGarden = async (newThing: Thing) => {
    res.mutate(newThing, false);
    if (getUUID(ptr.thing) === uuid) {
      // ptr doesn't need updating
      await res.saveToGarden(newThing);
    } else {
      await ptr.save(createPtr(slug, uuid));
      await res.saveToGarden(newThing);
    }
    res.mutate(newThing);
  };
  return res
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
  const res = useThing(slugToUrl(spaces, slug)) as SpaceResult;
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
  const container = metaspace && new URL(`${slug}/`, metaspace).toString();
  const publicGardenUrl =
    metaspace && new URL('private.ttl', container).toString();
  const privateGardenUrl =
    metaspace && new URL('public.ttl', container).toString();
  const nurseryUrl = metaspace && new URL('nursery.ttl', container).toString()
  const compostUrl = metaspace && new URL('compost.ttl', container).toString()
  const publicGarden = useGardenWithSetup(publicGardenUrl);
  const privateGarden = useGardenWithSetup(privateGardenUrl, true);
  const nursery = useGardenWithSetup(nurseryUrl);
  const compost = useGardenWithSetup(compostUrl);
  const setup = useCallback(async () => {
    if (getSpace(spaces, slug)) {
      await publicGarden.setupGarden();
      await privateGarden.setupGarden();
      await compost.setupGarden();
      await nursery.setupGarden();
      await res.saveSpace(
        spaces,
        createSpace(webId, container, HomeSpaceSlug, {
          compost: compostUrl,
          nursery: nurseryUrl,
          private: privateGardenUrl,
          public: publicGardenUrl,
        })
      );
    } else {
      throw new Error(
        `Space with slug ${slug} already exists in resource with URL ${
          spaces && getSourceUrl(spaces)
        }`
      );
    }
  }, [spaces, slug, webId]);
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
        console.log('spaces', spaces);
        console.log('setupSpace', res);
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