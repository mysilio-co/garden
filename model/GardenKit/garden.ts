import { Garden, GardenItem, GardenConfig, UUIDString } from './types';
import { createSolidDataset, createThing, getThing, setThing, buildThing } from '@inrupt/solid-client';
import { getUUID, base58Urn, wellKnownGardenUrn } from './utils';

export function getItemByUUID(garden: Garden, uuid: UUIDString): GardenItem {
  return getThing(garden, uuid);
}

export function getItemBySlug(garden: Garden, slug: string): GardenItem {
  const ptr = getThing(garden, slug);
  const uuid = getUUID(ptr);
  return getItemByUUID(garden, uuid);
}

export function getItemByName(garden: Garden, name: string): GardenItem {
  const slug = base58Urn(name.toLowerCase());
  return getItemBySlug(garden, slug);
}

const WellKnownConfigName = 'config';
export function getConfig(garden: Garden): GardenConfig {
  return getThing(garden, wellKnownGardenUrn(WellKnownConfigName));
}

function newConfig(): GardenConfig {
  return createThing({ url: wellKnownGardenUrn(WellKnownConfigName) });
}

export function ensureConfig(garden: Garden): Garden {
  if (getConfig(garden)) {
    return garden
  } else {
    return setThing(garden, newConfig());
  }
}

export function createNewGarden(): Garden {
  return createSolidDataset();
}
