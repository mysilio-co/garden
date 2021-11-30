import {
  createSolidDataset, getThing,
} from "@inrupt/solid-client";
import { useResource, useWebId, useThing } from "swrlit";
import { useWorkspacePreferencesFileUris } from './app';
import { getNewsletter } from '../model/publications';

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