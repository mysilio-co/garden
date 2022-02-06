import { Garden, GardenIndex, GardenFilter, UUID } from './types';

function useGardenEntry(garden: Garden, uuid: UUID) {
  // find entry in garden
  // find that entries garden index
  // return entry and setter to that index
}

function useTitledGardenEntry(garden: Garden, title: string) {
  // find uuid via sameAs
  // return useGardenEntry using uuid
}

export function useFilteredGarden(index: GardenIndex, filter: GardenFilter) {
  // call use garden
  // filter with Fuse
}

export default function useGarden(index: GardenIndex) {
  // Fetch main index
  // fetch subindexdes
}
