import {
  createSolidDataset,
  getThing,
  setThing,
  getUrl,
} from '@inrupt/solid-client';
import { useResource, useWebId, useThing } from "swrlit";
import { useWorkspace } from './app';
import { getNewsletter } from '../model/publications';
import { MY } from '../vocab';

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
  const { workspace } = useWorkspace(webId, workspaceSlug, 'private');
  const pub = getUrl(workspace, MY.News.publicationManifest);
  const res = useOrCreateResource(pub);
  res.manifest = res.resource;
  res.saveManifest = res.save;
  return res 
}

export function useNewsletter(webId, workspaceSlug, title) {
  const res = usePublicationManifest(
    webId,
    workspaceSlug
  );
  res.newsletter = getNewsletter(res.manifest, title);
  res.saveNewsletter = (newThing) => {
    const newManifest = newThing && setThing(res.manifest, thing);
    newManifest && res.saveManifest(newManifest);
  }
  return res; 
}