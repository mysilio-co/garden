import { Garden, GardenItem, GardenConfig, UUIDString, UUID, UrnString } from './types';
import {
  createSolidDataset,
  createThing,
  getThing,
  setThing,
  setUrl,
} from '@inrupt/solid-client';
import { OWL } from '@inrupt/vocab-common-rdf';
import { getUUID, base58Urn, createPtr, uuidUrn } from './utils';

export function getItemWithUUID(garden: Garden, uuid: UUIDString): GardenItem {
  return getThing(garden, uuid);
}

export function getItemWithSlug(garden: Garden, slug: string): GardenItem {
  const ptr = getThing(garden, slug);
  const uuid = getUUID(ptr);
  return getItemWithUUID(garden, uuid);
}

export function getItemWithTitle(garden: Garden, title: string): GardenItem {
  const slug = base58Urn(title);
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
  slug: string,
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
  const slug = base58Urn(title);
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
  // WRONG: not a url
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
