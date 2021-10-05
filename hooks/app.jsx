import { useState } from "react"
import equal from "fast-deep-equal/es6";

import { useThing, useWebId } from 'swrlit'
import {
  createSolidDataset, createThing, getUrl, setUrl,
  setThing, getThing, getBoolean
} from '@inrupt/solid-client'

import { useUnderstoryContainerUri, useStorageContainer } from './uris';
import { US } from '../vocab';
import { appPrefix } from '../utils/uris';
import { useWorkspaceContext } from '../contexts/WorkspaceContext';

import { useConcept } from '../hooks/concepts';
import { getAndParseNoteBody, createOrUpdateSlateJSON } from '../model/note';
import { createOrUpdateConceptIndex } from '../model/concept';


const appThingName = "app"

const prefsPath = "workspace/default/prefs.ttl"
const prefsWorkspaceName = "workspace"

function createNewAppResource(appContainerUri, privateAppContainerUri){
  let app = createThing({name: appThingName})
  let defaultWorkspace = createThing()
  defaultWorkspace = setUrl(defaultWorkspace, US.publicPrefs, `${appContainerUri}${prefsPath}#${prefsWorkspaceName}`)
  defaultWorkspace = setUrl(defaultWorkspace, US.privatePrefs, `${privateAppContainerUri}${prefsPath}#${prefsWorkspaceName}`)
  app = setUrl(app, US.hasWorkspace, defaultWorkspace)
  let resource = createSolidDataset()
  resource = setThing(resource, defaultWorkspace)
  resource = setThing(resource, app)
  return {app, resource}
}

function createWorkspacePrefs(conceptPrefix, tagPrefix, workspacePreferencesFileUri){
  let workspace = createThing({name: prefsWorkspaceName})
  workspace = setUrl(workspace, US.conceptPrefix, conceptPrefix)
  workspace = setUrl(workspace, US.tagPrefix, tagPrefix)
  workspace = setUrl(workspace, US.conceptIndex, new URL("concepts.ttl", workspacePreferencesFileUri).toString())
  workspace = setUrl(workspace, US.noteStorage, new URL("notes/", workspacePreferencesFileUri).toString())
  workspace = setUrl(workspace, US.backupsStorage, new URL(`backups/`, workspacePreferencesFileUri).toString())
  return workspace
}

export function useApp(webId){
  const appContainerUri = useUnderstoryContainerUri(webId)

  const privateAppContainerUri = useUnderstoryContainerUri(webId, 'private')
  const publicWorkspacePrefsUri = appContainerUri && `${appContainerUri}${prefsPath}#${prefsWorkspaceName}`
  const {save: savePublicPrefs} = useThing(publicWorkspacePrefsUri)
  const privateWorkspacePrefsUri = privateAppContainerUri && `${privateAppContainerUri}${prefsPath}#${prefsWorkspaceName}`
  const {save: savePrivatePrefs} = useThing(privateWorkspacePrefsUri)
  const appUri = appContainerUri && `${appContainerUri}app.ttl#${appThingName}`
  const {thing: app, saveResource: saveAppResource, ...rest} = useThing(appUri)
  const conceptPrefix = useConceptPrefix(webId, 'default')
  const tagPrefix = useTagPrefix(webId, 'default')

  async function initApp(){
    const { resource: appResource } = createNewAppResource(appContainerUri, privateAppContainerUri)
    await saveAppResource(appResource)
    const privatePrefs = createWorkspacePrefs(conceptPrefix, tagPrefix, privateWorkspacePrefsUri)
    await savePrivatePrefs(privatePrefs)
    const publicPrefs = createWorkspacePrefs(conceptPrefix, tagPrefix, publicWorkspacePrefsUri)
    await savePublicPrefs(publicPrefs)
    console.log("initialized!")
  }

  return {app, initApp, saveResource: saveAppResource, ...rest}
}

export function useWorkspacePreferencesFileUris(webId, workspaceSlug='default'){
  const { app } = useApp(webId)
  // we're ignoring the workspaceSlug parameter for now, but eventually we'll want to use this to get the currect workspace
  const { thing: workspaceInfo } = useThing(app && getUrl(app, US.hasWorkspace))
  return {
    public: workspaceInfo && getUrl(workspaceInfo, US.publicPrefs),
    private: workspaceInfo && getUrl(workspaceInfo, US.privatePrefs)
  }
}

function useConceptPrefix(webId, workspaceSlug){
  const storageContainerUri = useStorageContainer(webId)
  return storageContainerUri && `${storageContainerUri}${appPrefix}/${workspaceSlug}/concepts#`
}

function useTagPrefix(webId, workspaceSlug){
  const storageContainerUri = useStorageContainer(webId)
  return storageContainerUri && `${storageContainerUri}${appPrefix}/${workspaceSlug}/tags#`
}

export function useWorkspace(webId, slug, storage='public'){
  const workspacePreferencesFileUris = useWorkspacePreferencesFileUris(webId, slug)
  const workspacePreferencesFileUri = workspacePreferencesFileUris && workspacePreferencesFileUris[storage]
  const { thing: workspace, ...rest } = useThing(workspacePreferencesFileUri)

  return { workspace, slug, ...rest }

}

export function useCurrentWorkspace(storage='public'){
  const webId = useWebId()
  const { slug: workspaceSlug } = useWorkspaceContext()
  return useWorkspace(webId, workspaceSlug, storage)
}

function createSettings(){
  return createThing({name: "settings"})
}

export function useAppSettings(webId){
  const { app, resource: appResource, saveResource: saveAppResource } = useApp(webId)
  const settingsUri = app && getUrl(app, US.hasSettings)
  const settings = app && (settingsUri ? getThing(appResource, settingsUri) : createSettings())
  const save = (newSettings) => {
    let newAppResource = setThing(appResource, newSettings)
    newAppResource = setThing(newAppResource, setUrl(app, US.hasSettings, newSettings))
    return saveAppResource(newAppResource)
  }
  return { settings,  save }
}

export function useDevMode(webId){
  const { settings } = useAppSettings(webId)
  return settings && getBoolean(settings, US.devMode)
}

export function useConceptAndNote(webId, workspaceSlug, conceptName) {
  const [saving, setSaving] = useState(false)
  const { workspace } = useWorkspace(webId, workspaceSlug)
  const {
    concept,
    index: conceptIndex,
    saveIndex: saveConceptIndex,
  } = useConcept(webId, workspaceSlug, conceptName);

  const noteStorageUri = concept && getUrl(concept, US.storedAt);
  const {
    error: noteError,
    thing: note,
    save: saveNote,
    mutate: mutateNote,
  } = useThing(noteStorageUri);

  async function maybeSaveNoteBody(newValue) {
    const noteBody = getAndParseNoteBody(note)
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
        console.log("error saving note", e);
      } finally {
        setSaving(false);
      }
    }
  }

  return { note, concept, maybeSaveNoteBody, saving }
}