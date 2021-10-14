import {
  useState,
  useEffect,
} from "react";
import { useWebId, useThing } from "swrlit";
import {
  setStringNoLocale,
  getStringNoLocale,
  setThing,
  createSolidDataset,
  removeThing,
  getUrl,
  setUrl,
} from "@inrupt/solid-client";

import { useWorkspaceContext } from "../contexts/WorkspaceContext";

import {
  useConceptIndex,
  useConcept,
} from "../hooks/concepts";
import { useWorkspace } from "../hooks/app";

import { deleteResource } from "../utils/fetch";
import {
  createNote,
  noteStorageFileAndThingName,
} from "../model/note";
import { US } from "../vocab";
import { Loader } from './elements'

/*
This thing is a bit of a beast.

In order to make a note private at the moment we move it into a different directory inside either
the public or private directories in the user's POD. We do this because we don't want to muck around with
ACLs quite yet, but this design decision should be revisited soon.

For the moment, this means that we need to do several operations when we change privacy:

1) create the new note resource
2) update both the public and private index and finally
3) delete the old note resource

This is why we have so many hooks below, and two separate functions for making a note public or private.
*/
export default function PrivacyChanger({ name, changeTo, onFinished, ...rest }) {
  const [saving, setSaving] = useState(false);
  const webId = useWebId();
  const { slug: workspaceSlug } = useWorkspaceContext();
  const { concept } = useConcept(webId, workspaceSlug, name);
  const { index: privateIndex, save: savePrivateIndex } = useConceptIndex(
    webId,
    workspaceSlug,
    "private"
  );
  const { index: publicIndex, save: savePublicIndex } = useConceptIndex(
    webId,
    workspaceSlug,
    "public"
  );
  const { workspace: privateStorage } = useWorkspace(
    webId,
    workspaceSlug,
    "private"
  );
  const { workspace: publicStorage } = useWorkspace(
    webId,
    workspaceSlug,
    "public"
  );

  const publicNoteResourceUrl =
    publicStorage &&
    name &&
    `${getUrl(publicStorage, US.noteStorage)}${noteStorageFileAndThingName(
      name
    )}`;
  const { thing: publicNote, save: savePublicNote, mutate: mutatePublicNote } = useThing(
    publicNoteResourceUrl
  );

  const privateNoteResourceUrl =
    privateStorage &&
    name &&
    `${getUrl(privateStorage, US.noteStorage)}${noteStorageFileAndThingName(
      name
    )}`;
  const { thing: privateNote, save: savePrivateNote, mutate: mutatePrivateNote } = useThing(
    privateNoteResourceUrl
  );

  async function makePrivate() {
    await savePrivateNote(
      setStringNoLocale(
        privateNote || createNote(),
        US.slateJSON,
        getStringNoLocale(publicNote, US.slateJSON)
      )
    );
    await savePrivateIndex(
      setThing(
        privateIndex || createSolidDataset(),
        setUrl(concept, US.storedAt, privateNoteResourceUrl)
      )
    );
    await savePublicIndex(
      removeThing(publicIndex || createSolidDataset(), concept)
    );
    await deleteResource(publicNoteResourceUrl)
    // mutate here to ensure cached value of public note is not used in the future
    mutatePublicNote(null, true)
  }
  async function makePublic() {
    await savePublicNote(
      setStringNoLocale(
        publicNote || createNote(),
        US.slateJSON,
        getStringNoLocale(privateNote, US.slateJSON)
      )
    );
    await savePublicIndex(
      setThing(
        publicIndex || createSolidDataset(),
        setUrl(concept, US.storedAt, publicNoteResourceUrl)
      )
    );
    await savePrivateIndex(
      removeThing(privateIndex || createSolidDataset(), concept)
    );
    await deleteResource(privateNoteResourceUrl);
    // mutate here to ensure cached value of public note is not used in the future
    mutatePrivateNote(null, true)
  }
  useEffect(function () {
    if (!saving && publicIndex && privateIndex && concept &&
      (((changeTo === 'private') && publicNote) ||
        (changeTo === 'public') && privateNote)) {
      async function changePrivacy() {
        setSaving(true)
        if (changeTo === 'private') {
          console.log("making private!!")
          await makePrivate()
        } else if (changeTo === 'public') {
          console.log("making public!!")
          await makePublic()
        } else {
          console.warn("indexes are loaded but notes are both falsy! doing nothing for now.")
        }
        setSaving(false)
        onFinished()
      }
      changePrivacy()
    }
  }, [publicIndex, privateIndex, concept, publicNote, privateNote])
  return (
    <Loader />
  );
}