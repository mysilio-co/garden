import { useMemo, useState } from "react";
import { Garden, GardenIndex, GardenItem, UUIDString } from './types';
import { getItemByName, getItemByUUID } from './garden';
import { asUrl } from '@inrupt/solid-client';
import { useResource, useThing } from 'swrlit';

export type GardenResult = { garden: Garden; saveGarden: any };
export type FilteredGardenResult = { garden: Garden };
export type GardenItemResult = { item: GardenItem; saveToGarden: any };
export type GardenFilter = {
  // right now, we only support search based filtering,
  // but leave room for additional filter criteria later.
  search: string;
};
export function useGardenItem(
  garden: Garden,
  uuid: UUIDString
): GardenItemResult {
  const item = getItemByUUID(garden, uuid);
  const { thing, saveThing } = useThing(asUrl(item))
  return {
    item: thing,
    saveToGarden: saveThing,
  };
}

export function useNamedGardenIten(
  garden: Garden,
  name: string
): GardenItemResult {
  const item = getItemByName(garden, name);
  const { thing, saveThing } = useThing(asUrl(item))
  return {
    item: thing,
    saveToGarden: thing,
  };
}

function fuseEntryFromGardenEntry(thing) {
  if (isConcept(thing)) {
    return {
      thing: thing,
      type: 'note',
      name: urlSafeIdToConceptName(conceptIdFromUri(asUrl(thing))),
    };
  } else if (isBookmarkedImage(thing)) {
    return {
      thing: thing,
      type: 'image',
      name: thing && getStringNoLocale(thing, DCTERMS.title),
    };
  } else if (isBookmarkedFile(thing)) {
    return {
      thing: thing,
      type: 'file',
      name: thing && getStringNoLocale(thing, DCTERMS.title),
    };
  } else if (isBookmarkedLink(thing)) {
    return {
      thing: thing,
      type: 'link',
      name: asUrl(thing),
    };
  }
  return {};
}

function fuseFromGarden(garden) {
  return garden && garden.map(fuseEntryFromGardenEntry);
}

function useFuse(garden: Garden) {
  const options = {
    includeScore: true,
    threshold: 0.3,
    keys: ['name']
  };
  const [fuse] = useState(new Fuse([], options));
  return useMemo(() => {
    fuse.setCollection(fuseFromGarden(garden) || []);
    return { fuse };
  }, [garden]);
}

export function useFilteredGarden(
  index: GardenIndex,
  filter: GardenFilter
): FilteredGardenResult {
  // call use garden
  const { garden } = useGarden(index);
  // filter with Fuse
  return {
    garden,
  };
}

export default function useGarden(index: GardenIndex): GardenResult {
  // Fetch main index
  // fetch subindexdes
  const { resource, saveResource } = useResource(index)
  return {
    garden: resource,
    saveGarden: saveResource,
  };
}
