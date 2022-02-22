import { useMemo, useState } from "react";
import { Garden, GardenIri, GardenItem, Space, UUIDString , SpaceIri} from './types';
import { getItemByTitle, getItemByUUID, createNewGarden } from './garden';
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
  const res = useThing(asUrl(item))
  res.itme = res.thing;
  res.saveToGarden = res.saveThing;
  return res;
}

export function useTitleGardenIten(
  garden: Garden,
  name: string
): GardenItemResult {
  const item = getItemByTitle(garden, name);
  const res = useThing(asUrl(item))
  res.item = res.thing
  res.saveToGarden = res.saveThing
  return res;
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
