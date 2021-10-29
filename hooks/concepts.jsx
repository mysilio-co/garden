import { useMemo, useState } from "react";
import { dataset } from "@rdfjs/dataset";
import {
  createSolidDataset,
  getThingAll,
  getDatetime,
  asUrl,
  getUrl,
  setUrl,
  getThing,
  createThing,
  toRdfJsDataset,
} from "@inrupt/solid-client";
import { DCTERMS } from "@inrupt/vocab-common-rdf";
import { useResource, useWebId, useThing } from "swrlit";
import Fuse from "fuse.js";

import { useConceptContainerUri } from "./uris";
import { useWorkspace } from "./app";
import { US } from "../vocab";
import { conceptNameToUrlSafeId, urlSafeIdToConceptName } from "../utils/uris";
import { defaultNoteStorageUri } from "../model/note";
import { conceptIdFromUri } from '../model/concept';
import { isConcept } from '../utils/rdf';
import { useCurrentWorkspace } from "./app";
import { useMemoCompare } from "./react";
import equal from "fast-deep-equal/es6";

export function useWorkspaceIndex(
  webId,
  workspaceSlug = 'default',
  storage = 'public'
) {
  const { workspace } = useWorkspace(webId, workspaceSlug, storage);
  const conceptIndexUri = workspace && getUrl(workspace, US.conceptIndex);
  const { resource, error, ...rest } = useResource(conceptIndexUri);
  if (error && error.statusCode === 404) {
    const index = createSolidDataset();
    return { index, error, ...rest };
  } else {
    return { index: resource, error, ...rest };
  }
}

export function useCombinedWorkspaceIndexDataset(webId, workspaceSlug) {
  const { index: privateIndex } = useWorkspaceIndex(
    webId,
    workspaceSlug,
    "private"
  );
  const { index: publicIndex } = useWorkspaceIndex(
    webId,
    workspaceSlug,
    "public"
  );

  const combinedIndex = useMemo(() => {
    const privateIndexDataset = privateIndex && toRdfJsDataset(privateIndex)
    const publicIndexDataset = publicIndex && toRdfJsDataset(publicIndex)
    return dataset([
      ...(privateIndexDataset || []),
      ...(publicIndexDataset || []),
    ])
  }, [publicIndex, privateIndex])
  return {
    index: combinedIndex,
  };
}

export function useConceptPrefix(webId, workspaceSlug) {
  const { workspace } = useWorkspace(webId, workspaceSlug);
  const conceptPrefix = workspace && getUrl(workspace, US.conceptPrefix);
  return conceptPrefix;
}

function maybeNewConcept(url, workspace, name) {
  return (
    url &&
    workspace &&
    name &&
    setUrl(
      createThing({ name }),
      US.storedAt,
      defaultNoteStorageUri(workspace, name)
    )
  );
}

export function useConcept(
  webId,
  workspaceSlug,
  name,
  newConceptPrivacy = "private"
) {
  const conceptPrefix = useConceptPrefix(webId, workspaceSlug);
  const conceptUri =
    conceptPrefix && name && `${conceptPrefix}${conceptNameToUrlSafeId(name)}`;

  const { index: privateIndex, save: savePrivateIndex } = useWorkspaceIndex(
    webId,
    workspaceSlug,
    "private"
  );
  const { index: publicIndex, save: savePublicIndex } = useWorkspaceIndex(
    webId,
    workspaceSlug,
    "public"
  );
  const publicConcept =
    publicIndex && conceptUri && getThing(publicIndex, conceptUri);
  const privateConcept =
    privateIndex && conceptUri && getThing(privateIndex, conceptUri);
  const { workspace } = useWorkspace(webId, workspaceSlug, newConceptPrivacy);
  const thisConcept =
    publicConcept ||
    privateConcept ||
    maybeNewConcept(conceptUri, workspace, name);
  const concept = useMemoCompare(thisConcept, equal);
  if (conceptUri) {
    if (publicConcept) {
      return {
        conceptUri,
        concept,
        index: publicIndex,
        saveIndex: savePublicIndex,
        privacy: 'public'
      };
    } else if (privateConcept) {
      return {
        conceptUri,
        concept,
        index: privateIndex,
        saveIndex: savePrivateIndex,
        privacy: 'private'
      };
    } else if (thisConcept) {
      // this means there's no public or private concept but we did successfully create a new one
      return {
        conceptUri,
        concept,
        index: (newConceptPrivacy == 'private') ? privateIndex : publicIndex,
        saveIndex: (newConceptPrivacy == 'private') ? savePrivateIndex : savePublicIndex,
        privacy: 'newConceptPrivacy'
      }
    } else if (privateIndex && publicIndex) {
      return {
        conceptUri,
        concept,
        index: privateIndex,
        saveIndex: savePrivateIndex,
      };
    } else {
      return {
        conceptUri,
        index: publicIndex,
        saveIndex: savePublicIndex,
      };
    }
  } else {
    return {};
  }
}

export function useWorkspaceThings(webId, storage, workspaceSlug) {
  const { index, ...rest } = useWorkspaceIndex(webId, workspaceSlug, storage);
  const things = index && getThingAll(index);
  return { things, ...rest };
}

export function useConceptThings(webId, storage, workspaceSlug) {
  const { things, ...rest } = useWorkspaceThings(webId, storage, workspaceSlug);
  return {
    concepts: things.filter(hasNote),
    ...rest,
  };
}

export function useGarden(webId, workspaceSlug = "default") {
  const { things: publicGarden } = useWorkspaceThings(
    webId,
    'public',
    workspaceSlug
  );
  const { things: privateGarden } = useWorkspaceThings(
    webId,
    'private',
    workspaceSlug
  );

  const garden =
    (publicGarden || privateGarden) &&
    [...(publicGarden || []), ...(privateGarden || [])].sort(
      (a, b) =>
        getDatetime(b, DCTERMS.modified) - getDatetime(a, DCTERMS.modified)
    );
  const result = useMemoCompare({ garden }, equal);
  return result;
}

export function useConcepts(webId, workspaceSlug = "default") {
  const { concepts: publicConcepts } = useConceptThings(
    webId,
    "public",
    workspaceSlug
  );
  const { concepts: privateConcepts } = useConceptThings(
    webId,
    'private',
    workspaceSlug
  );

  const concepts =
    (publicConcepts || privateConcepts) &&
    [...(publicConcepts || []), ...(privateConcepts || [])].sort(
      (a, b) =>
        getDatetime(b, DCTERMS.modified) - getDatetime(a, DCTERMS.modified)
    );
  const result = useMemoCompare({ concepts }, equal);
  return result;
}

export function useConceptNames(webId) {
  const { concepts } = useConcepts(webId);
  const conceptNames = concepts && concepts.map(c => urlSafeIdToConceptName(conceptIdFromUri(asUrl(c))))
  const result = useMemoCompare(conceptNames, equal);
  return result;
}

export function useConceptInCurrentWorkspace(name) {
  const webId = useWebId();
  const { slug: workspaceSlug } = useCurrentWorkspace();
  return useConcept(webId, workspaceSlug, name);
}

export function useConceptNamesMatching(search) {
  const [fuse] = useState(new Fuse([], { includeScore: true }));
  const webId = useWebId();
  const { concepts } = useConcepts(webId);
  return useMemo(
    function findMatchingConceptNames() {
      if (search) {
        const names =
          concepts &&
          concepts.map((concept) =>
            urlSafeIdToConceptName(conceptIdFromUri(asUrl(concept)))
          );
        fuse.setCollection(names || []);
        const result = fuse.search(search);
        return result.map(({ item }) => item);
      }
    },
    [concepts, search]
  );
}

export function useNote(concept) {
  const noteStorageUri = concept && getUrl(concept, US.storedAt);
  const { thing: note, save: saveNote } = useThing(noteStorageUri);
  return { note, saveNote };
}
