import { useMemo, useState, Fragment } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import equal from 'fast-deep-equal/es6';
import { Transition } from '@headlessui/react'

import { setThing, removeThing } from "@inrupt/solid-client/thing/thing";
import { useProfile, useMyProfile } from "swrlit";
import { useWebId, useAuthentication } from 'swrlit/contexts/authentication'
import { useThing, useFile } from 'swrlit/hooks/things'

import { useTitledGardenItem } from 'garden-kit/hooks';
import { getNoteValue, noteThingToSlateObject, createThingFromSlateJSOElement } from 'garden-kit/note'
import { getNote, updateItemBeforeSave, setTags, setReferences } from 'garden-kit/items'
import { thingsToArray, arrayToThings } from 'garden-kit/collections'
import { getDepiction, setDepiction } from 'garden-kit/utils'
import { setPublicAccess, setPublicAccessBasedOnGarden } from 'garden-kit/acl'

import { urlSafeIdToConceptName } from "../utils/uris";
import { getTagsInNote, getReferencesInNote } from '../utils/slate'

import { useAutosave } from '../hooks/editor'
import { useImageUploadUri } from '../hooks/uris';

import ImageUploadModal from './modals/ImageUpload'
import LeftNavLayout from './LeftNavLayout'
import NoteHeader from './NoteHeader';
import Editor from './Plate/Editor'
import WebMonetization from './WebMonetization';
import { deleteResource } from '../utils/fetch';
import ConnectionsPanel from './ConnectionsPanel'
import { Share as ShareIcon, UploadImage as UploadImageIcon } from './icons'
import { NoteProvider } from '../contexts/NoteContext'
import PodImage from './PodImage'

export default function NotePage({ editorId, webId, spaceSlug, slug, gardenUrl }) {
  const myWebId = useWebId()
  const router = useRouter()
  const itemName = slug && urlSafeIdToConceptName(slug);
  const { item, save: saveItem, resource: garden, saveResource: saveGarden } = useTitledGardenItem(gardenUrl, itemName)

  // these two should be in the same resource as of 8/2022 - TV
  const noteBodyResourceUrl = item && getNote(item)
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
      newItem = setReferences(newItem, getReferencesInNote(newValue))

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

  const { fetch } = useAuthentication()

  async function deleteItem() {
    if (noteBody) {
      await deleteResource(noteBodyResourceUrl, { fetch })
    }
    await saveGarden(removeThing(garden, item))
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
  const imageUploadUri = useImageUploadUri(webId, spaceSlug)
  const [coverImageUploaderOpen, setCoverImageUploaderOpen] = useState(false)
  async function setCoverImage(url) {
    await setPublicAccessBasedOnGarden([url], garden, { fetch })
    await saveItem(setDepiction(item, url))
    setCoverImageUploaderOpen(false)
  }
  const coverImageUrl = item && getDepiction(item)
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
        <div className="absolute top-0 right-0 text-gray-500 bg-gray-100 rounded-bl-lg z-40 flex flex-col">
          <button onClick={() => setCoverImageUploaderOpen(true)}
            className="w-10 h-10 flex flex-row items-center justify-center hover:text-gray-400"
          >
            <UploadImageIcon className="w-6 h-6 pointer-events-none" />
            <ImageUploadModal open={coverImageUploaderOpen} setOpen={setCoverImageUploaderOpen}
              onSave={(url) => setCoverImage(url)} uploadContainerUri={imageUploadUri} />
          </button>
          <button onClick={() => setPanelOpen(true)}
            className="w-10 h-10 flex flex-row items-center justify-center hover:text-gray-400"
          >
            <ShareIcon className="w-6 h-6 pointer-events-none" />
          </button>
        </div>
      </Transition>
      <div>
        {coverImageUrl && (
          <PodImage className="h-36 w-full overflow-hidden object-cover" src={coverImageUrl} alt={itemName} />
        )}
      </div>
      <div className="flex flex-row w-full">
        <div className="mx-10 grow">
          <NoteProvider webId={webId} spaceSlug={spaceSlug} gardenUrl={gardenUrl} name={itemName}>
            {value && <Editor
              editorId={editorId}
              initialValue={value}
              conceptNames={conceptNames}
              editableProps={{ className: 'overflow-auto h-5/6' }}
              onChange={onChange}
              readOnly={myNote === false}
            />}
          </NoteProvider>
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
          <ConnectionsPanel className="w-full md:w-auto shrink-0"
            item={item} itemName={itemName}
            webId={webId} spaceSlug={spaceSlug}
            onClose={() => setPanelOpen(false)} />
        </Transition>
      </div>

    </LeftNavLayout>
  )
}