import { Garden, GardenItem, GardenConfig, UUIDString, UUID, UrnString } from './types';
import {
  createSolidDataset,
  createThing,
  getThing,
  setThing,
} from '@inrupt/solid-client';
import { getUUID, base58Urn, createPtr } from './utils';

export function getItemByUUID(garden: Garden, uuid: UUIDString): GardenItem {
  return getThing(garden, uuid);
}

export function getItemBySlug(garden: Garden, slug: string): GardenItem {
  const ptr = getThing(garden, slug);
  const uuid = getUUID(ptr);
  return getItemByUUID(garden, uuid);
}

export function getItemByTitle(garden: Garden, title: string): GardenItem {
  const slug = base58Urn(title);
  return getItemBySlug(garden, slug);
}

export function setItem(garden: Garden, item: GardenItem): Garden {
  return setThing(garden, item);
}

export function setItemBySlug(
  garden: Garden,
  slug: string,
  item: GardenItem
): Garden {
  const uuid = getUUID(item);
  garden = setItem(garden, item);
  garden = setThing(garden, createPtr(slug, uuid));
  return garden;
}

export function setItemByTitle(
  garden: Garden,
  title: string,
  item: GardenItem
): Garden {
  const slug = base58Urn(title);
  return setItemBySlug(garden, slug, item);
}

const ConfigSlug = 'garden';
export function getConfig(garden: Garden): GardenConfig {
  return getItemBySlug(garden, ConfigSlug);
}

export function setConfig(garden: Garden, config: GardenConfig): Garden {
  return setThing(garden, config);
}

export function createConfig(): GardenConfig {
  return createThing({ url: ConfigSlug });
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
