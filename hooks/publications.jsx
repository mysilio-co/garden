import {
  createSolidDataset, getThing,
} from "@inrupt/solid-client";
import { useResource, useWebId, useThing } from "swrlit";
import { useWorkspacePreferencesFileUris } from './app';

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
  const { privatePrefix } = useWorkspacePreferencesFileUris(
    webId,
    workspaceSlug
  );
  const publicationsIri = privatePrefix && `${privatePrefix}publications.ttl`;
  return useOrCreateResource(publicationsIri);
}

export function useNewsletter(webId, title, workspaceSlug) {
  const manifest = usePublicationManifest(webId, workspaceSlug);
  return getThing(manifest, newsletterIdFromTitle);
}