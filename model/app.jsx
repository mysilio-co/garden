
import {
  createSolidDataset,
  createThing,
  getUrl,
  setUrl,
  setThing,
} from '@inrupt/solid-client';

import { US, MY } from '../vocab';

export const AppThingName = 'app';

export const PrefsPath = 'workspace/default/prefs.ttl';
export const PrefsWorkspaceName = 'workspace';

export function createNewAppResource(appContainerUri, privateAppContainerUri) {
  let app = createThing({ name: AppThingName });
  let defaultWorkspace = createThing();
  defaultWorkspace = setUrl(
    defaultWorkspace,
    US.publicPrefs,
    `${appContainerUri}${PrefsPath}#${PrefsWorkspaceName}`
  );
  defaultWorkspace = setUrl(
    defaultWorkspace,
    US.privatePrefs,
    `${privateAppContainerUri}${PrefsPath}#${PrefsWorkspaceName}`
  );
  app = setUrl(app, US.hasWorkspace, defaultWorkspace);
  let resource = createSolidDataset();
  resource = setThing(resource, defaultWorkspace);
  resource = setThing(resource, app);
  return { app, resource };
}

function ensureUrl(workspace, url, value) {
  if (!workspace || !url || !value || getUrl(workspace, url)) {
    return workspace;
  } else {
    return setUrl(workspace, url, value);
  }
}

export function ensureUrl(workspace, url, value) {
  if (!workspace || !url || !value || getUrl(workspace, url)) {
    return workspace;
  } else {
    return setUrl(workspace, url, value);
  }
}

export function ensureWorkspace(
  workspace,
  conceptPrefix,
  tagPrefix,
  workspacePreferencesFileUri
) {
  workspace = workspace || createThing({ name: PrefsWorkspaceName });
  workspace = ensureUrl(workspace, US.conceptPrefix, conceptPrefix);
  workspace = ensureUrl(workspace, US.tagPrefix, tagPrefix);
  if (workspacePreferencesFileUri) {
    workspace = ensureUrl(
      workspace,
      US.conceptIndex,
      new URL('concepts.ttl', workspacePreferencesFileUri).toString()
    );
    workspace = ensureUrl(
      workspace,
      MY.News.publicationManifest,
      new URL('publications.ttl', workspacePreferencesFileUri).toString()
    );
    workspace = ensureUrl(
      workspace,
      US.noteStorage,
      new URL('notes/', workspacePreferencesFileUri).toString()
    );
    workspace = ensureUrl(
      workspace,
      US.backupsStorage,
      new URL(`backups/`, workspacePreferencesFileUri).toString()
    );
  }
  return workspace;
}

export function createWorkspacePrefs(
  conceptPrefix,
  tagPrefix,
  workspacePreferencesFileUri
) {
  return ensureWorkspace(
    undefined,
    conceptPrefix,
    tagPrefix,
    workspacePreferencesFileUri
  );
}