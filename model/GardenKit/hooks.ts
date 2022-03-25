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
  createGarden,
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
  res.saveToGarden = useCallback(async (newThing: Thing) => {
    res.mutate(newThing, false);
    if (getUUID(ptr.thing) === uuid) {
      // ptr doesn't need updating
      await res.saveToGarden(newThing);
    } else {
      await ptr.save(createPtr(slug, uuid));
      await res.saveToGarden(newThing);
    }
    res.mutate(newThing);
  }, [res, ptr, slug, uuid]);
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

export function useGarden(index: GardenFile): GardenResult {
  const res = useResource(index) as GardenResult;
  const config = res.garden && getConfig(res.garden);
  res.garden = res.resource;
  res.config = config;
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
  const setup = useCallback(async () => {
    if (res && res.error && res.error.statusCode === 404) {
      await res.saveGarden(createGarden());
      publicRead && (await res.savePublicAccess({ read: publicRead }));
    } else {
      if (res && res.garden) {
        throw new Error(
          `Garden already exists in at URL ${getSourceUrl(res.garden)}`
        );
      }
    }
  }, [res, publicRead]);
  res.setupGarden = setup;
  return res;
}

export function useSpace(webId: WebId, slug: Slug): SpaceResult {
  const { spaces } = useSpaces(webId);
  const res = useThing(slugToUrl(spaces, slug)) as SpaceResult;
  res.space = res.thing;
  res.saveSpace = res.save;
  return res;
}

export function useSpaceWithSetup(
  webId: WebId,
  slug: Slug
): SpaceWithSetupResult {
  const { spaces } = useSpaces(webId);
  const res = useSpace(webId, slug) as SpaceWithSetupResult;
  const metaspace = getContainer(getMetaSpace(spaces));
  const container = metaspace && new URL(`${slug}/`, metaspace).toString();
  const publicGardenUrl =
    metaspace && new URL('public.ttl', container).toString();
  const privateGardenUrl =
    metaspace && new URL('private.ttl', container).toString();
  const nurseryUrl = metaspace && new URL('nursery.ttl', container).toString();
  const compostUrl = metaspace && new URL('compost.ttl', container).toString();
  const publicGarden = useGardenWithSetup(publicGardenUrl, true);
  const privateGarden = useGardenWithSetup(privateGardenUrl);
  const nursery = useGardenWithSetup(nurseryUrl);
  const compost = useGardenWithSetup(compostUrl);
  const setup = useCallback(async () => {
    if (spaces && getSpace(spaces, slug)) {
      throw new Error(
        `Space with slug ${slug} already exists in resource with URL ${getSourceUrl(
          spaces
        )}`
      );
    } else {
      privateGarden && (await privateGarden.setupGarden());
      compost && (await compost.setupGarden());
      nursery && (await nursery.setupGarden());
      publicGarden && (await publicGarden.setupGarden());
      spaces &&
        container &&
        (await res.saveSpace(
          createSpace(webId, container, HomeSpaceSlug, {
            compost: compostUrl,
            nursery: nurseryUrl,
            private: privateGardenUrl,
            public: publicGardenUrl,
          })
        ));
    }
  }, [
    spaces,
    slug,
    publicGarden,
    privateGarden,
    compost,
    nursery,
    res,
    container,
    webId,
  ]);
  res.setupSpace = setup;
  return res;
}

export function useMetaSpace(webId: WebId): SpaceResult {
  return useSpace(webId, MetaSpaceSlug);
}

export function useMetaSpaceWithSetup(webId: WebId): SpaceWithSetupResult {
  const { spaces, saveSpaces } = useSpaces(webId);
  const res = useMetaSpace(webId) as SpaceWithSetupResult;
  const { profile } = useProfile(webId);
  const setup = useCallback(async () => {
    if (spaces && getMetaSpace(spaces)) {
      throw new Error(
        `MetaSpace already exists in resource with URL ${
          spaces && getSourceUrl(spaces)
        }`
      );
    } else {
      spaces &&
        (await saveSpaces(
          setMetaSpace(spaces, createMetaSpace(webId, profile))
        ));
    }
  }, [spaces, webId, profile, res]);
  res.setupSpace = setup;
  return res;
}

export function useSpaces(webId: WebId): SpacePreferencesResult {
  const { profile } = useProfile(webId);
  const res = useResource(
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
  const meta = useMetaSpaceWithSetup(webId);
  const home = useSpaceWithSetup(webId, HomeSpaceSlug);
  const setup = useCallback(async () => {
    if (res.spaces && hasRequiredSpaces(res.spaces)) {
      throw new Error(
        `All required Spaces already exist in resource with URL ${
          res.spaces && getSourceUrl(res.spaces)
        }`
      );
    } else {
      if (res.spaces && !getMetaSpace(res.spaces)) {
        await meta.setupSpace();
      }
      if (res.spaces && getSpaceAll(res.spaces).length <= 0) {
        await home.setupSpace();
      }
    }
  }, [webId, res, meta, home]);
  res.setupDefaultSpaces = setup;
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