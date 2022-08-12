import { useMemo, useEffect, useState, Fragment } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import equal from 'fast-deep-equal/es6';
import { Transition } from '@headlessui/react'

import { asUrl, setThing, removeThing } from "@inrupt/solid-client/thing/thing";
import { getSolidDataset } from '@inrupt/solid-client/resource/solidDataset'
import { toRdfJsDataset } from '@inrupt/solid-client/rdfjs'
import { useProfile, useMyProfile } from "swrlit";
import { useAuthentication, useWebId } from 'swrlit/contexts/authentication'
import { useThing } from 'swrlit/hooks/things'

import { useTitledGardenItem, useSpace } from 'garden-kit/hooks';
import { getNoteValue, noteThingToSlateObject, createThingFromSlateJSOElement } from 'garden-kit/note'
import { getAbout, updateItemBeforeSave, setTags } from 'garden-kit/items'
import { thingsToArray, arrayToThings } from 'garden-kit/collections'
import { getGardenFileAll } from 'garden-kit/spaces'

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
import { deleteResource } from '../utils/fetch';
import ConnectionsPanel from './ConnectionsPanel'
import { Share as ShareIcon, ArrowSquareLeft as ArrowSquareLeftIcon } from './icons'

class GardenIndex {
  constructor(gardens) {
    this.datasets = gardens.filter(x => x).map(toRdfJsDataset)
  }

  match(subject, predicate, object, graph) {
    const results = []
    for (let dataset of this.datasets) {
      const m = dataset.match(subject, predicate, object, graph)
      for (let q of m) {
        results.push(q)
      }
    }
    return results
  }
}



function useItemIndex(webId, spaceSlug) {
  const [lastLoad, setLastLoad] = useState(new Date())
  const { space } = useSpace(webId, spaceSlug)
  const gardenUrls = getGardenFileAll(space)
  const { fetch } = useAuthentication()
  const [index, setIndex] = useState({})
  useEffect(async function () {
    const gardens = await Promise.all(
      gardenUrls.map(gardenUrl => {
        try {
          return getSolidDataset(gardenUrl, { fetch })
        } catch {
          return null
        }
      })
    )
    setIndex(new GardenIndex(gardens))
  }, [lastLoad, ...gardenUrls])
  return { index }
}

export default function NotePage({ editorId, webId, spaceSlug, slug, gardenUrl }) {
  const index = useItemIndex(webId, spaceSlug)
  const myWebId = useWebId()
  const router = useRouter()
  const itemName = slug && urlSafeIdToConceptName(slug);
  const { item, save: saveItem, resource: itemResource, saveResource: saveItemResource } = useTitledGardenItem(gardenUrl, itemName)

  // these two should be in the same resource as of 8/2022 - TV
  const noteBodyResourceUrl = item && getAbout(item)
  const { thing: noteBody } = useThing(noteBodyResourceUrl)
  const { thing: valueThing, resource: noteResource, saveResource: saveNoteResource } =
    useThing(noteBody && getNoteValue(noteBody))

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
        await saveItem(newItem)
      } catch (e) {
        console.log('error saving note', e);
      } finally {
        setSaving(false);
      }
    }
  }

  async function deleteItem() {
    if (noteBody) {
      await deleteResource(noteBodyResourceUrl)
    }
    await saveItemResource(removeThing(itemResource, item))
    router.push("/")
  }

  const conceptNames = []

  const { profile: authorProfile } = useProfile(webId);
  const { profile: currentUserProfile } = useMyProfile();

  const myNote = (webId === myWebId)

  const headerProps = useMemo(() => ({
    item, itemName, authorProfile, gardenUrl,
    currentUserProfile, myNote, deleteItem, saving, spaceSlug
  }), [
    item, itemName, authorProfile, gardenUrl,
    currentUserProfile, myNote, deleteItem, saving, spaceSlug
  ])
  const { onChange } = useAutosave(item, maybeSaveNoteBody)

  const [panelOpen, setPanelOpen] = useState(false)
  return (
    <LeftNavLayout pageName={itemName} HeaderComponent={NoteHeader} headerProps={headerProps} >
      <Head>
        <title>{itemName}</title>
      </Head>
      <WebMonetization webId={webId} />
      <Transition
        show={!panelOpen} as={Fragment}
        enter="transform transition ease-in-out duration-500 sm:duration-700"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-500 sm:duration-700"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <button onClick={() => setPanelOpen(true)}
          className="absolute top-0 right-0 w-18 h-18 text-gray-500 hover:text-gray-400 bg-gray-100 rounded-bl-lg flex flex-row py-6 pl-2 pr-4 z-40"
        >
          <ArrowSquareLeftIcon className="w-6 h-6 pointer-events-none" />
          <ShareIcon className="w-6 h-6 pointer-events-none" />
        </button>
      </Transition>
      <div className="flex flex-row w-full">
        <div className="mx-8 flex-grow">
          {value && <Editor
            editorId={editorId}
            initialValue={value}
            conceptNames={conceptNames}
            editableProps={{ className: 'overflow-auto h-5/6' }}
            onChange={onChange}
            readOnly={myNote === false}
          />}
        </div>
        <Transition
          show={panelOpen} as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <ConnectionsPanel className="w-full md:w-auto"
            item={item} itemName={itemName}
            webId={webId} spaceSlug={spaceSlug} itemIndex={index}
            onClose={() => setPanelOpen(false)} />
        </Transition>
      </div>

    </LeftNavLayout>
  )
}