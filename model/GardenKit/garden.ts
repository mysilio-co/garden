import { Garden, GardenItem, GardenConfig, UUIDString, UUID, UrnString, Slug} from './types';
import {
  createSolidDataset,
  createThing,
  getThing,
  setThing,
  setUrl,
  getSourceUrl,
} from '@inrupt/solid-client';
import { OWL } from '@inrupt/vocab-common-rdf';
import { getUUID, encodeBase58Slug, createPtr, uuidUrn, slugToUrl} from './utils';

export function getItemWithUUID(garden: Garden, uuid: UUID): GardenItem {
  return getThing(garden, uuid);
}

export function getItemWithSlug(garden: Garden, slug: Slug): GardenItem {
  const ptr = getThing(garden, slugToUrl(garden, slug));
  const uuid = getUUID(ptr);
  return getItemWithUUID(garden, uuid);
}

export function getItemWithTitle(garden: Garden, title: string): GardenItem {
  const slug = encodeBase58Slug(title);
  return getItemWithSlug(garden, slug);
}

export function setItemWithUUID(garden: Garden, item: GardenItem): Garden {
  if (!getUUID(item)) {
    item = setUrl(item, OWL.sameAs, uuidUrn());
  }

  return setThing(garden, item);
}

export function setItemWithSlug(
  garden: Garden,
  slug: Slug,
  item: GardenItem
): Garden {
  const uuid = getUUID(item);
  garden = setItemWithUUID(garden, item);
  garden = setThing(garden, createPtr(slug, uuid));
  return garden;
}

export function setItemWithTitle(
  garden: Garden,
  title: string,
  item: GardenItem
): Garden {
  const slug = encodeBase58Slug(title);
  return setItemWithSlug(garden, slug, item);
}

const ConfigSlug = 'garden';
export function getConfig(garden: Garden): GardenConfig {
  return getItemWithSlug(garden, ConfigSlug);
}

export function setConfig(garden: Garden, config: GardenConfig): Garden {
  return setThing(garden, config);
}

export function createConfig(): GardenConfig {
  return createThing({ name: ConfigSlug });
}

export function ensureConfig(garden: Garden): Garden {
  if (getConfig(garden)) {
    return garden;
  } else {
    return setThing(garden, createConfig());
  }
}

export function createNewGarden(): Garden {
  return ensureConfig(createSolidDataset());
}
