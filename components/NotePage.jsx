import { useMemo } from 'react'
import Head from 'next/head'
import equal from 'fast-deep-equal/es6';

import { asUrl, setThing, createThing } from "@inrupt/solid-client/thing/thing";
import { useProfile, useMyProfile, useWebId } from "swrlit";
import { useThing } from 'swrlit/hooks/things'

import { useTitledGardenItem } from 'garden-kit/hooks';
import { getNoteValue, noteThingToSlateObject, createThingFromSlateJSOElement } from 'garden-kit/note'
import { getAbout } from 'garden-kit/items'
import { thingsToArray, arrayToThings } from 'garden-kit/collections'

import { urlSafeIdToConceptName } from "../utils/uris";

import { useConceptAndNote } from '../hooks/app';
import { useCombinedWorkspaceIndexDataset } from '../hooks/concepts'

import LeftNavLayout from './LeftNavLayout'
import NoteHeader from './NoteHeader';
import ConceptEditor from './ConceptEditor';
import Editor from './Plate/Editor'
import WebMonetization from './WebMonetization';

export default function NotePage({ editorId, webId, workspaceSlug, slug, gardenUrl }) {
  const myWebId = useWebId()
  const conceptName = slug && urlSafeIdToConceptName(slug);
  console.log("concept name", slug, conceptName)
  const { item, saveToGarden } = useTitledGardenItem(gardenUrl, conceptName)

  // these two should be in the same resource as of 8/2022
  const { thing: noteBody } = useThing(item && getAbout(item))
  const { thing: valueThing, resource: noteResource, saveResource: saveNoteResource } = useThing(noteBody && getNoteValue(noteBody))

  console.log("note value Thing", valueThing)
  let value;
//  try {
    value = valueThing && noteResource && thingsToArray(valueThing, noteResource, noteThingToSlateObject)
  /*} catch {
    value = null
  }*/
  console.log("nb", value)

  async function maybeSaveNoteBody(newValue) {
    if (newValue && !equal(newValue, value)) {
      console.log("new", newValue)
      const noteBodyThings = arrayToThings(newValue, createThingFromSlateJSOElement)
      let newNoteResource = noteBodyThings.reduce((m, t) => t ? setThing(m, t) : m, noteResource)

//      setSaving(true);
      try {
        await saveNoteResource(newNoteResource);
        console.log("SAVED!!")
      } catch (e) {
        console.log('error saving note', e);
      } finally {
//        setSaving(false);
      }
    }
  }

  const privacy = true
  const deleteConcept = () => { }
  const conceptNames = []
  const index = null

  const { profile: authorProfile } = useProfile(webId);
  const { profile: currentUserProfile } = useMyProfile();
  const myNote = (webId === myWebId)
  const headerProps = useMemo(() => ({
    concept: item, saveConcept: saveToGarden, conceptName, authorProfile,
    currentUserProfile, myNote, privacy, deleteConcept
  }), [
    item, saveToGarden, conceptName, authorProfile,
    currentUserProfile, myNote, privacy, deleteConcept
  ])
  return (
    <LeftNavLayout pageName={conceptName} HeaderComponent={NoteHeader} headerProps={headerProps} >
      <Head>
        <title>{conceptName}</title>
      </Head>
      <WebMonetization webId={webId} />
      {value && <Editor
        editorId={editorId}
        initialValue={value}
        conceptNames={conceptNames}
        editableProps={{ className: 'overflow-auto h-5/6' }}
        onChange={maybeSaveNoteBody}
      />}
    </LeftNavLayout>
  )
}