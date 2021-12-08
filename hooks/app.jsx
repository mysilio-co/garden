import { useState, useEffect } from 'react';
import equal from 'fast-deep-equal/es6';

import { useThing, useWebId } from 'swrlit';
import {
  createSolidDataset,
  createThing,
  getUrl,
  setUrl,
  setThing,
  getThing,
  getBoolean,
  removeThing,
} from '@inrupt/solid-client';
import { dequal } from 'dequal';

import { useUnderstoryContainerUri, useStorageContainer } from './uris';
import { US, MY } from '../vocab';
import { appPrefix } from '../utils/uris';
import { useWorkspaceContext } from '../contexts/WorkspaceContext';

import { useConcept } from '../hooks/concepts';
import { getAndParseNoteBody, createOrUpdateSlateJSON } from '../model/note';
import { createOrUpdateConceptIndex } from '../model/concept';
import { deleteResource } from '../utils/fetch';
import {
  createNewAppResource,
  createWorkspacePrefs,
  ensureWorkspace,
  AppThingName,
  PrefsPath,
  PrefsWorkspaceName
} from '../model/app';

export function useApp(webId) {
  const appContainerUri = useUnderstoryContainerUri(webId);

  const privateAppContainerUri = useUnderstoryContainerUri(webId, 'private');
  const publicWorkspacePrefsUri =
    appContainerUri && `${appContainerUri}${PrefsPath}#${PrefsWorkspaceName}`;
  const { save: savePublicPrefs } = useThing(publicWorkspacePrefsUri);
  const privateWorkspacePrefsUri =
    privateAppContainerUri &&
    `${privateAppContainerUri}${PrefsPath}#${PrefsWorkspaceName}`;
  const { save: savePrivatePrefs } = useThing(privateWorkspacePrefsUri);
  const appUri = appContainerUri && `${appContainerUri}app.ttl#${AppThingName}`;
  const {
    thing: app,
    saveResource: saveAppResource,
    ...rest
  } = useThing(appUri);
  const conceptPrefix = useConceptPrefix(webId, 'default');
  const tagPrefix = useTagPrefix(webId, 'default');

  async function initApp() {
    const { resource: appResource } = createNewAppResource(
      appContainerUri,
      privateAppContainerUri
    );
    await saveAppResource(appResource);
    const privatePrefs = createWorkspacePrefs(
      conceptPrefix,
      tagPrefix,
      privateWorkspacePrefsUri
    );
    await savePrivatePrefs(privatePrefs);
    const publicPrefs = createWorkspacePrefs(
      conceptPrefix,
      tagPrefix,
      publicWorkspacePrefsUri
    );
    await savePublicPrefs(publicPrefs);
    console.log('initialized!');
  }

  return { app, initApp, saveResource: saveAppResource, ...rest };
}

export function useWorkspacePreferencesFileUris(
  webId,
  workspaceSlug = 'default'
) {
  const { app } = useApp(webId);
  // we're ignoring the workspaceSlug parameter for now, but eventually we'll want to use this to get the currect workspace
  const { thing: workspaceInfo } = useThing(
    app && getUrl(app, US.hasWorkspace)
  );
  return {
    public: workspaceInfo && getUrl(workspaceInfo, US.publicPrefs),
    private: workspaceInfo && getUrl(workspaceInfo, US.privatePrefs),
  };
}

function useConceptPrefix(webId, workspaceSlug) {
  const storageContainerUri = useStorageContainer(webId);
  return (
    storageContainerUri &&
    `${storageContainerUri}${appPrefix}/${workspaceSlug}/concepts#`
  );
}

function useTagPrefix(webId, workspaceSlug) {
  const storageContainerUri = useStorageContainer(webId);
  return (
    storageContainerUri &&
    `${storageContainerUri}${appPrefix}/${workspaceSlug}/tags#`
  );
}

export function useWorkspace(webId, slug, storage = 'public') {
  const workspacePreferencesFileUris = useWorkspacePreferencesFileUris(
    webId,
    slug
  );
  const workspacePreferencesFileUri =
    workspacePreferencesFileUris && workspacePreferencesFileUris[storage];
  const tagPrefix = useTagPrefix(webId, slug);
  const conceptPrefix = useConceptPrefix(webId, slug);
  const {
    thing: workspace,
    save: saveWorkspace,
    ...rest
  } = useThing(workspacePreferencesFileUri);
  const ensuredWorkspace = ensureWorkspace(
    workspace,
    conceptPrefix,
    tagPrefix,
    workspacePreferencesFileUri
  );
  useEffect(() => {
    if (workspace && !dequal(ensuredWorkspace, workspace)) {
      console.log('updating workspace from:', workspace);
      console.log('updating workspace to:', ensuredWorkspace);
      saveWorkspace(ensuredWorkspace);
    }
  }, [ensuredWorkspace, workspace]);
  return { workspace: ensuredWorkspace, slug, saveWorkspace, ...rest };
}

export function useCurrentWorkspace(storage = 'public') {
  const webId = useWebId();
  const { slug: workspaceSlug } = useWorkspaceContext();
  return useWorkspace(webId, workspaceSlug, storage);
}

function createSettings() {
  return createThing({ name: 'settings' });
}

export function useAppSettings(webId) {
  const {
    app,
    resource: appResource,
    saveResource: saveAppResource,
  } = useApp(webId);
  const settingsUri = app && getUrl(app, US.hasSettings);
  const settings =
    app &&
    (settingsUri ? getThing(appResource, settingsUri) : createSettings());
  const save = (newSettings) => {
    let newAppResource = setThing(appResource, newSettings);
    newAppResource = setThing(
      newAppResource,
      setUrl(app, US.hasSettings, newSettings)
    );
    return saveAppResource(newAppResource);
  };
  return { settings, save };
}

export function useDevMode(webId) {
  const { settings } = useAppSettings(webId);
  return settings && getBoolean(settings, US.devMode);
}

export function useConceptAndNote(webId, workspaceSlug, conceptName) {
  const [saving, setSaving] = useState(false);
  const { workspace } = useWorkspace(webId, workspaceSlug);
  const {
    concept,
    index: conceptIndex,
    saveIndex: saveConceptIndex,
    privacy,
  } = useConcept(webId, workspaceSlug, conceptName);

  const noteStorageUri = concept && getUrl(concept, US.storedAt);
  const {
    error: noteError,
    thing: note,
    save: saveNote,
    mutate: mutateNote,
  } = useThing(noteStorageUri);

  async function maybeSaveNoteBody(newValue) {
    const noteBody = getAndParseNoteBody(note);
    if (newValue && !equal(newValue, noteBody)) {
      const newNote = createOrUpdateSlateJSON(newValue, note);
      const newConceptIndex = createOrUpdateConceptIndex(
        newValue,
        workspace,
        conceptIndex,
        concept,
        conceptName
      );
      setSaving(true);
      try {
        await saveNote(newNote);
        await saveConceptIndex(newConceptIndex);
      } catch (e) {
        console.log('error saving note', e);
      } finally {
        setSaving(false);
      }
    }
  }

  async function saveConcept(newConcept) {
    return await saveConceptIndex(setThing(conceptIndex, newConcept));
  }

  async function deleteConcept() {
    await Promise.all([
      deleteResource(noteStorageUri),
      concept && saveConceptIndex(removeThing(conceptIndex, concept)),
    ]);
    // mutate to invalidate the cache for the note
    mutateNote();
  }

  return {
    note,
    noteError,
    maybeSaveNoteBody,
    concept,
    saveConcept,
    deleteConcept,
    saving,
    privacy,
  };
}
