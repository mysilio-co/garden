import { useEffect, useState } from 'react'
import useSWR from 'swr'

import rdfjsDatasetModule from "@rdfjs/dataset";

import { useMemoCompare } from 'swrlit/hooks/react';
import { dequal } from 'dequal'

import { getSolidDataset } from '@inrupt/solid-client/resource/solidDataset'
import { getThingAll, asUrl } from '@inrupt/solid-client/thing/thing'
import { fromRdfJsDataset, toRdfJsDataset } from '@inrupt/solid-client/rdfjs'
import { useAuthentication } from 'swrlit/contexts/authentication'

import { useSpace } from 'garden-kit/hooks';
import { getGardenFileAll } from 'garden-kit/spaces'
import { getTitle } from 'garden-kit/utils'
import { isItem } from 'garden-kit/items'
import { useSwrld } from 'swrlit';

function* gardensToQuads(gardens) {
  for (let dataset of gardens.filter(x => x).map(toRdfJsDataset)) {
    for (let quad of dataset) {
      yield quad
    }
  }
}

const itemIndexFetcher = (fetch) => async (...gardenUrls) => {
  const gardens = await Promise.all(
    gardenUrls ? gardenUrls.map(gardenUrl => {
      try {
        return getSolidDataset(gardenUrl, { fetch })
      } catch {
        return null
      }
    }) : []
  )
  const index = { uri: {}, name: {} }
  for (let g of gardens) {
    const things = getThingAll(g)
    for (let t of things) {
      if (isItem(t)) {
        index.uri[asUrl(t)] = {
          garden: g,
          item: t
        }
        const name = getTitle(t)
        if (name) {
          index.name[name] = {
            garden: g,
            item: t
          }
        }
      }
    }
  }
  const dataset = rdfjsDatasetModule.dataset(gardensToQuads(gardens))
  const solidDataset = fromRdfJsDataset(dataset)
  return { index, dataset, solidDataset }
}

export function useItemIndex(webId, spaceSlug) {
  const { space } = useSpace(webId, spaceSlug)
  const gardenUrls = useMemoCompare(space && getGardenFileAll(space), dequal)
  const { fetch } = useAuthentication()
  return useSWR(gardenUrls, itemIndexFetcher(fetch))
}
