import { WS } from '@inrupt/vocab-solid-common'
import { getUrl } from '@inrupt/solid-client/thing/get'
import { useProfile } from 'swrlit'
import { appPrefix } from '../utils/uris'
import useSWR from 'swr'

export function useStorageContainer(webId) {
  const { profile } = useProfile(webId)
  return profile && getUrl(profile, WS.storage)
}

export function useUnderstoryContainerUri(webId, path = 'public') {
  const storageContainer = useStorageContainer(webId)
  return storageContainer && `${storageContainer}${path}/${appPrefix}/`
}

export function useImageUploadUri(webId, path='public') {
  const understoryContainerUri = useUnderstoryContainerUri(webId, path)
  return understoryContainerUri && `${understoryContainerUri}images/`
}

export function useFileContainerUri(webId, path = 'public') {
  const understoryContainerUri = useUnderstoryContainerUri(webId, path);
  return understoryContainerUri && `${understoryContainerUri}files/`;
}

export function useArchiveContainerUri(webId, path = 'public') {
  const storageContainer = useStorageContainer(webId)
  return storageContainer && `${storageContainer}${path}/${appPrefix}/messages/archive`
}

const fetcher = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export function useOGTags(url) {
  const { data, error, isValidating } = useSWR(
    url ? `/api/fetch-og-tags/${encodeURIComponent(url)}` : null,
    fetcher
  );
  return data;
}