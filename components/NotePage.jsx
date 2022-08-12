import { useMemo, useState } from 'react'
import Head from 'next/head'
import equal from 'fast-deep-equal/es6';

import { asUrl, setThing, createThing } from "@inrupt/solid-client/thing/thing";
import { useProfile, useMyProfile, useWebId } from "swrlit";
import { useThing } from 'swrlit/hooks/things'

import { useTitledGardenItem } from 'garden-kit/hooks';
import { getNoteValue, noteThingToSlateObject, createThingFromSlateJSOElement } from 'garden-kit/note'
import { getAbout, updateItemBeforeSave, setTags } from 'garden-kit/items'
import { thingsToArray, arrayToThings } from 'garden-kit/collections'

import { urlSafeIdToConceptName } from "../utils/uris";
import { getTagsInNote } from '../utils/slate'

import { useConceptAndNote } from '../hooks/app';
import { useCombinedWorkspaceIndexDataset } from '../hooks/concepts'
import { useAutosave } from '../hooks/editor'

import LeftNavLayout from './LeftNavLayout'
import NoteHeader from './NoteHeader';
import ConceptEditor from './ConceptEditor';
import Editor from './Plate/Editor'
import WebMonetization from './WebMonetization';

export default function NotePage({ editorId, webId, spaceSlug, slug, gardenUrl }) {
  const myWebId = useWebId()
  const itemName = slug && urlSafeIdToConceptName(slug);
  const { item, saveToGarden } = useTitledGardenItem(gardenUrl, itemName)

  // these two should be in the same resource as of 8/2022 - TV
  const { thing: noteBody } = useThing(item && getAbout(item))
  const { thing: valueThing, resource: noteResource, saveResource: saveNoteResource } = useThing(noteBody && getNoteValue(noteBody))

  const value = valueThing && noteResource && thingsToArray(valueThing, noteResource, noteThingToSlateObject)

  const [saving, setSaving] = useState(false)

  async function maybeSaveNoteBody(newValue) {
    if (newValue && !equal(newValue, value)) {
      const noteBodyThings = arrayToThings(newValue, createThingFromSlateJSOElement)
      let newNoteResource = noteBodyThings.reduce((m, t) => t ? setThing(m, t) : m, noteResource)

      let newItem = updateItemBeforeSave(item)
      newItem = setTags(newItem, getTagsInNote(newValue))

      setSaving(true);
      try {
        await saveNoteResource(newNoteResource);
        await saveToGarden(newItem)
      } catch (e) {
        console.log('error saving note', e);
      } finally {
        setSaving(false);
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
    item, saveConcept: saveToGarden, itemName, authorProfile, gardenUrl,
    currentUserProfile, myNote, privacy, deleteConcept, saving, spaceSlug
  }), [
    item, saveToGarden, itemName, authorProfile, gardenUrl,
    currentUserProfile, myNote, privacy, deleteConcept, saving, spaceSlug
  ])
  const { onChange } = useAutosave(item, maybeSaveNoteBody)
  return (
    <LeftNavLayout pageName={itemName} HeaderComponent={NoteHeader} headerProps={headerProps} >
      <Head>
        <title>{itemName}</title>
      </Head>
      <WebMonetization webId={webId} />
      <div className="mx-8">
        {value && <Editor
          editorId={editorId}
          initialValue={value}
          conceptNames={conceptNames}
          editableProps={{ className: 'overflow-auto h-5/6' }}
          onChange={onChange}
          readOnly={myNote === false}
        />}
      </div>
    </LeftNavLayout>
  )
}