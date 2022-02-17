import { useMemo, useState } from "react";
import { Garden, GardenIri, GardenItem, Space, UUIDString , SpaceIri} from './types';
import { getItemByName, getItemByUUID, createNewGarden } from './garden';
import { asUrl, WebId } from '@inrupt/solid-client';
import { useResource, useThing, useWebId } from 'swrlit';

export type GardenResult = { garden: Garden; saveGarden: any };
export type FilteredGardenResult = { garden: Garden };
export type GardenItemResult = { item: GardenItem; saveToGarden: any };
export type SpaceResult = { space: Space; saveToGarden: any };
export type GardenFilter = {
  // right now, we only support search based filtering
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

export function useFilteredGarden(
  index: GardenIri,
  filter: GardenFilter
): FilteredGardenResult {
  // call use garden
  const { garden } = useGarden(index);
  // filter with Fuse
  return {
    garden,
  };
}

export function useSpace(iri: SpaceIri) {

};

export function useSpaces(webId: WebId) {

}

export function useSettings(appName: string) {

}

export function useGarden(index: GardenIri): GardenResult {
  const { resource, saveResource, error } = useResource(index);
  if (error && error.statusCode === 404) {
    const newGarden = createNewGarden();
    return {
      garden: newGarden,
      saveGarden: saveResource,
    };
  } else {
    return {
      garden: resource,
      saveGarden: saveResource,
    };
  }
}
