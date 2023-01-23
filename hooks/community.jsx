import { setThing, setUrl } from '@inrupt/solid-client';
import {
  getNurseryFile,
  getPublicFile,
  HomeSpaceSlug,
  useGarden,
  useSpace,
  useSpaces,
  useSpaceWithSetup,
} from 'garden-kit';
import { RDFS } from '@inrupt/vocab-common-rdf';
import { useCallback } from 'react';
import { useResource } from 'swrlit';

export const CommunityNurseryUrl =
  process.env.COMMUNITY_NURSERY_URL ||
  'https://mysilio.me/mysilio/spaces/home/nursery.ttl';
export const CommunityGardenUrl =
  process.env.COMMUNITY_GARDEN_URL ||
  'https://mysilio.me/mysilio/spaces/home/public.ttl';

export function useCommunityNursery() {
  const res = useGarden(CommunityNurseryUrl);
  const publishItemReference = useCallback(
    async (originalGardenUrl, gardenItem) => {
      const gardenItemReference = setUrl(
        gardenItem,
        RDFS.seeAlso,
        originalGardenUrl
      );
      const newGarden = res.garden && setThing(res.garden, gardenItemReference);
      console.log(res.garden);
      if (newGarden) {
        return await res.saveGarden(newGarden);
      } else {
        throw Error('Could not publish to Community Garden');
      }
    },
    [res]
  );
  res.publishItemReference = publishItemReference;
  return res;
}

export function useCommunityGarden() {
  return useGarden(CommunityGardenUrl);
}
