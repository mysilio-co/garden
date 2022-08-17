import {
  createThing,
} from "@inrupt/solid-client/thing/thing";
import {
  setStringNoLocale,
} from "@inrupt/solid-client/thing/set";
import {
  getUrl,
  getStringNoLocale,
} from "@inrupt/solid-client/thing/get";

import { noteBodyToSlateJSON } from "../utils/slate";
import { conceptNameToUrlSafeId } from "../utils/uris";
import { saveThing } from "../utils/fetch";
import { US } from "../vocab";

const thingName = "concept";

export function createNote() {
  return createThing({ name: thingName });
}

export function noteStorageFileAndThingName(name) {
  return name && `${conceptNameToUrlSafeId(name)}.ttl#${thingName}`;
}

export function defaultNoteStorageUri(workspace, name) {
  const containerUri = workspace && getUrl(workspace, US.noteStorage);
  return containerUri && name && `${containerUri}${noteStorageFileAndThingName(name)}`;
}

export function createOrUpdateNoteBody(note, value) {
  let newNote = note || createNote();
  newNote = setStringNoLocale(newNote, US.noteBody, JSON.stringify(value));
  return newNote;
}

export function createOrUpdateSlateJSON(value, note) {
  let newNote = note || createNote();
  newNote = setStringNoLocale(newNote, US.slateJSON, JSON.stringify(value));
  return newNote;
}

export async function saveNote(note, concept) {
  const noteStorageUri = concept && getUrl(concept, US.storedAt);
  return await saveThing(noteStorageUri, note);
}

export function getAndParseNoteBody(note) {
  const bodyJSON = note && getStringNoLocale(note, US.noteBody);
  const slateJSON = note && getStringNoLocale(note, US.slateJSON);
  if (slateJSON) {
    return JSON.parse(slateJSON);
  } else if (bodyJSON) {
    return noteBodyToSlateJSON(JSON.parse(bodyJSON))
  } else {
    return null
  }
}
