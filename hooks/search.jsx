import { getThingAll } from '@inrupt/solid-client';
import { FOAF } from '@inrupt/vocab-common-rdf';
import { useCommunityContacts, useCommunityGarden } from './community';

export function useCommunityContactsSearch(search) {
  const { contacts } = useCommunityContacts();
  const entries = getThingAll(contacts).map((contact) => {
    return {
      name: getStringNoLocale(contact, FOAF.name);
    }
  });
}

export function useGardenSearch(search, garden) {}

export function useSpacesSearch(searc, spaces) {}

export function useFuse(search, entries, keys, fuseIndexFile) {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: fuseIndex } = useSWR(fuseIndexFile, fetcher);

  const options = {
    includeScore: true,
    threshold: 0.3,
    keys: keys,
  };

  const fuse = useMemo(() => {
    if (fuseIndex) return new Fuse(entries, options, fuseIndex);
    else return new Fuse(entries, options);
  }, [entries, fuseIndex]);

  return fuse.search(search);
}
