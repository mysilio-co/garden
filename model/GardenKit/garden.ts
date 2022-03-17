import {
  Garden,
  GardenItem,
  GardenConfig,
  GardenFile,
  UUID,
  Slug,
} from './types';
import { createThing, getThing, saveSolidDatasetAt, setThing, setUrl } from '@inrupt/solid-client';
import { OWL } from '@inrupt/vocab-common-rdf';
import {
  getUUID,
  encodeBase58Slug,
  createPtr,
  uuidUrn,
  slugToUrl,
} from './utils';

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

export function ensureGardenConfig(garden: Garden): Garden {
  let config = getConfig(garden) || createThing({ name: ConfigSlug });
  return setThing(garden, config);
}