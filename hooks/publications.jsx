import {
  createSolidDataset,
} from "@inrupt/solid-client";
import { useResource, useWebId, useThing } from "swrlit";

export function useOrCreateResource(iri) {
  const response = useResource(iri);
  const { error } = response;
  if (error && error.statusCode === 404) {
    const emptyResource = createSolidDataset();
    response.resource = emptyResource;
    return response;
  } else {
    return response;
  }
}

export function usePublicationManifest(webId, workspaceSlug) {
  const { public} = useWorkspacePreferencesFileUris( webId, workspaceSlug);
  const publicationsIri = public && `${public}publications.ttl`;
  return useOrCreateResource(publicationsIri);
}

export function useSubscriptionsManifest(webId, workspaceSlug) {
  const {private} = useWorkspacePreferencesFileUris( webId, workspaceSlug);
  const subscriptionsIri = private && `${private}subscriptions.ttl`;
  return useOrCreateResource(subscriptionsIri);
}