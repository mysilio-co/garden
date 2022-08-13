import { useEffect, useState } from 'react'

import rdfjsDatasetModule from "@rdfjs/dataset";

import { useMemoCompare } from 'swrlit/hooks/react';
import { dequal } from 'dequal'

import { getSolidDataset } from '@inrupt/solid-client/resource/solidDataset'
import { getThingAll, asUrl } from '@inrupt/solid-client/thing/thing'
import { fromRdfJsDataset, toRdfJsDataset } from '@inrupt/solid-client/rdfjs'
import { useAuthentication } from 'swrlit/contexts/authentication'

import { useSpace } from 'garden-kit/hooks';
import { getGardenFileAll } from 'garden-kit/spaces'

function* gardensToQuads(gardens) {
  for (let dataset of gardens.filter(x => x).map(toRdfJsDataset)) {
    for (let quad of dataset) {
      yield quad
    }
  }
}

export function useItemIndex(webId, spaceSlug) {
  const [lastLoad, setLastLoad] = useState(new Date())
  const { space } = useSpace(webId, spaceSlug)
  const gardenUrls = useMemoCompare(space && getGardenFileAll(space), dequal)
  const { fetch } = useAuthentication()
  const [index, setIndex] = useState(null)
  const [dataset, setDataset] = useState(null)
  const [solidDataset, setSolidDataset] = useState(null)
  useEffect(async function () {
    const gardens = await Promise.all(
      gardenUrls ? gardenUrls.map(gardenUrl => {
        try {
          return getSolidDataset(gardenUrl, { fetch })
        } catch {
          return null
        }
      }) : []
    )
    const i = {}
    for (let g of gardens) {
      const things = getThingAll(g)
      for (let t of things) {
        i[asUrl(t)] = {
          garden: g,
          item: t
        }
      }
    }
    setIndex(i)

    const dataset = rdfjsDatasetModule.dataset(gardensToQuads(gardens))
    setDataset(dataset)
    setSolidDataset(fromRdfJsDataset(dataset))
  }, [lastLoad, gardenUrls])
  function mutate() {
    setLastLoad(new Date())
  }
  return { index, dataset, solidDataset, mutate }
}