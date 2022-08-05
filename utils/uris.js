import * as base58 from "micro-base58";
import { v1 as uuid } from 'uuid';

export const appPrefix =
  process.env.NEXT_PUBLIC_APP_PREFIX || "apps/understory/garden"

export const handleToWebId = (handle) =>
  new TextDecoder().decode(base58.decode(handle));

export const webIdToHandle = (webId) =>
  webId && base58.encode(webId);

export function profilePath(webId) {
  return `/u/${webIdToHandle(webId)}`;
}

export function gardenPath(webId, spaceSlug, gardenUrl){
  return `/g/${webIdToHandle(webId)}/${spaceSlug}/${base58.encode(gardenUrl)}`
}

export function understoryGardenConceptPrefix(webId, workspaceSlug) {
  return (
    webId &&
    workspaceSlug &&
    `https://${window.location.hostname}${profilePath(webId)}/${workspaceSlug}/`
  );
}

export function notePath(webId, workspaceSlug, name) {
  return (
    webId &&
    name &&
    `${profilePath(webId)}/${workspaceSlug}/${conceptNameToUrlSafeId(name)}`
  );
}

export function itemPath(webId, spaceSlug, gardenUrl, name) {
  return (
    webId &&
    name &&
    `${gardenPath(webId, spaceSlug, gardenUrl)}/${conceptNameToUrlSafeId(name)}`
  );
}

// deprecated
export function publicNotePath(webId, workspaceSlug, name) {
  return (
    webId &&
    name &&
    `${profilePath(webId)}/${workspaceSlug}/${conceptNameToUrlSafeId(name)}`
  );
}

// deprecated
export function privateNotePath(workspaceSlug, name) {
  return name && `/notes/${workspaceSlug}/${conceptNameToUrlSafeId(name)}`;
}

export function noteUriToWebId(noteUri) {
  return `https://${new URL(noteUri).hostname}/profile/card#me`;
}

export const conceptNameToUrlSafeId = (name) =>
  name && base58.encode(name.toLowerCase());

export const urlSafeIdToConceptName = (id) =>
  new TextDecoder().decode(base58.decode(id));

export const urlSafeIdToGardenUrl = (id) =>
  new TextDecoder().decode(base58.decode(id));

export const conceptUriToId = (conceptUri) =>
  conceptUri.split("#").slice(-1)[0];

export const conceptUriToName = (conceptUri) =>
  urlSafeIdToConceptName(conceptUriToId(conceptUri));

export function tagNameToUrlSafeId(tagName) {
  return encodeURIComponent(tagName);
}

export function urlFromHost(hostOrUrl) {
  try {
    new URL(hostOrUrl);
    // if this doesn't throw, it's a valid URL
    return hostOrUrl
  } catch (_) {
    return `https://${hostOrUrl}`
  }
}

export function uuidUrn() {
  return `urn:uuid:${uuid()}`;
}
