import { useState, useContext, useCallback, useEffect } from 'react'
import { getPlateActions } from "@udecode/plate-core";
import { useRouter } from 'next/router'

import { useTitledGardenItem, useSpace } from 'garden-kit/hooks'
import { getNurseryFile } from 'garden-kit/spaces'
import {
  createItem,
  setNote,
  setImage,
  setBookmark,
  setFile,
  updateItemBeforeSave,
  setTags,
  setReferences
} from 'garden-kit/items'
import { setDepiction } from 'garden-kit/utils';
import { EmptySlateJSON, createNoteInSpace } from 'garden-kit/note'
import { useWebId, useAuthentication } from 'swrlit/contexts/authentication'

import SpaceContext from '../../contexts/SpaceContext'
import { Close as CloseIcon, TickCircle } from '../icons'
import Editor from "../Plate/Editor"
import { useItemIndex } from "../../hooks/items"
import { itemPath } from '../../utils/uris'
import { useOGTags, useImageUploadUri, useFileUploadUri } from '../../hooks/uris';
import ImageUploadModal from './ImageUpload'
import { UploadImage as UploadImageIcon } from '../icons'
import PodImage from '../PodImage'
import { uploadFromFile } from '../../components/ImageUploader';
import { getTagsInNote, getReferencesInNote } from '../../utils/slate'


const editorId = 'create-modal';

export default function NewItem({ onClose }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [itemFile, setItemFile] = useState('')
  const [url, setUrl] = useState('')
  const [noteValue, setNoteValue] = useState()

  // basic item loading - provides save function and ability to tell if item exists yet
  const webId = useWebId();
  const { slug: spaceSlug } = useContext(SpaceContext);
  const { space } = useSpace(webId, spaceSlug)
  const gardenUrl = getNurseryFile(space)
  const { save: saveItem, resource: garden } = useTitledGardenItem(gardenUrl, name);
  const { data } = useItemIndex(webId, spaceSlug)
  const { index } = data || {}
  const itemExists = !!(index && index.name[name])

  // url auto-loading
  const og = useOGTags(url);
  useEffect(() => {
    if (og) {
      // OG tags were update (i.e. new URL)
      // set title, name, description
      if (og && og.ogTitle && !name) {
        setName(og.ogTitle);
      }
      if (og && og.ogDescription && !description) {
        setDescription(og.ogDescription);
      }
      if (og && og.ogImage && og.ogImage.url && !coverImage) {
        setCoverImage(og.ogImage.url);
      }
    }
  }, [og, name, description, coverImage]);

  // cover image uploader
  const imageUploadUri = useImageUploadUri(webId, spaceSlug)
  const [coverImageUploaderOpen, setCoverImageUploaderOpen] = useState(false)
  const onSaveCoverImage = useCallback(function onSaveCoverImage(url) {
    setCoverImage(url)
    setCoverImageUploaderOpen(false)
  })

  // file uploader
  const fileUploadUri = useFileUploadUri(webId, spaceSlug)
  const onFileChanged = useCallback(async function (file) {
    if (fileUploadUri && file) {
      const fileUrl = `${fileUploadUri}${encodeURIComponent(file.name)}`
      await uploadFromFile(file, fileUrl);
      setItemFile(fileUrl);
    }
  }, [fileUploadUri])

  // control functions
  const reset = useCallback(function reset() {
    const { value: setEditorValue, resetEditor } = getPlateActions(editorId)
    resetEditor()
    setEditorValue(EmptySlateJSON);
    setNoteValue(null)
    setName('');
  }, [])

  const [saving, setSaving] = useState(false);
  const { fetch } = useAuthentication()
  const save = useCallback(async function save() {
    setSaving(true);
    let newItem = createItem(webId, { title: name, description })
    newItem = updateItemBeforeSave(newItem)
    if (coverImage) {
      newItem = setDepiction(newItem, coverImage)
      newItem = setImage(newItem, coverImage)
    }
    if (url) {
      newItem = setBookmark(newItem, url)
    }
    if (itemFile) {
      newItem = setFile(newItem, itemFile)
    }
    if (noteValue) {
      newItem = setTags(newItem, getTagsInNote(noteValue))
      newItem = setReferences(newItem, getReferencesInNote(noteValue))
    }
    newItem = setNote(newItem, await createNoteInSpace(space, noteValue || EmptySlateJSON, { fetch }))
    await saveItem(newItem)
    setSaving(false)
    router.push(itemPath(webId, spaceSlug, gardenUrl, name))
  }, [webId, spaceSlug, gardenUrl, router, name, description, coverImage, itemFile, url, space, noteValue, saveItem, webId])

  const onSubmit = useCallback(async function onSubmit() {
    await save();
    reset();
    onClose();
  }, [reset, save, onClose])

  const cancel = useCallback(function cancel() {
    onClose();
  }, [onClose]);

  const conceptNames = index && Object.keys(index.name)

  const createDisabled = (!name || itemExists || saving)
  return (
    <div className="mx-auto rounded-lg overflow-hidden bg-white flex flex-col items-stretch">
      <div className="flex flex-row justify-between self-stretch h-18 p-6 bg-my-green">
        <div className="flex flex-row justify-start items-start gap-4 text-white font-semibold">
          Create New Item
        </div>
        <CloseIcon
          className="text-white h-6 w-6 flex-grow-0 cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="divide-1 divide-gray-100">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start px-6 py-5">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-900"
          >
            Name
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col">
            <input
              type="text"
              name="name"
              id="name"
              className={`ipt ${itemExists ? 'error' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {itemExists && (
              <span className="ipt-error-message mt-1">
                an item with this name already exists
              </span>
            )}
          </div>
          <label htmlFor="url" className="text-sm font-medium text-gray-900">
            URL
          </label>
          <input
            type="url"
            name="url"
            id="url"
            className="ipt sm:col-span-2"
            onChange={(e) => setUrl(e.target.value)}
          />
          <label htmlFor="url" className="text-sm font-medium text-gray-900">
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            className="ipt sm:col-span-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="image" className="text-sm font-medium text-gray-900">
            Image
          </label>
          <button onClick={() => setCoverImageUploaderOpen(true)}
            className="w-10 h-10 flex flex-row items-center justify-center hover:text-gray-400"
          >
            <UploadImageIcon className="w-6 h-6 pointer-events-none" />
            <ImageUploadModal open={coverImageUploaderOpen} setOpen={setCoverImageUploaderOpen}
              onSave={(url) => onSaveCoverImage(url)} uploadContainerUri={imageUploadUri} />
          </button>
          <div className="">
            {coverImage && <PodImage src={coverImage} className="h-16" />}
          </div>
          <label htmlFor="file" className="text-sm font-medium text-gray-900">
            File
          </label>
          <input
            id="file"
            name="file"
            type="file"
            className="file-ipt sm:col-span-2"
            onChange={useCallback((e) => {
              const f = e.target.files && e.target.files[0];
              onFileChanged(f);
            }, [onFileChanged])}
          />
        </div>
        <div className="px-6 py-5 h-96">
          <Editor
            editorId={editorId}
            initialValue={EmptySlateJSON}
            conceptNames={conceptNames}
            editableProps={{ className: 'overflow-auto h-24' }}
            onChange={(newValue) => setNoteValue(newValue)}
          />
        </div>
      </div>
      <div className="h-20 bg-gray-50 flex flex-row justify-end items-center px-6">
        <button
          onClick={reset}
          className="btn-md btn-filled btn-square h-10 mr-1"
        >
          Clear
        </button>
        <button
          onClick={cancel}
          className="btn-md btn-filled btn-square h-10 mr-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          className={`btn-md btn-filled btn-square h-10 ${createDisabled ? 'ring-gray-300 text-gray-300' : 'ring-my-green text-my-green'}  flex flex-row justify-center items-center`}
          disabled={createDisabled}
        >
          Create
          <TickCircle className={`ml-1 ${createDisabled ? 'text-gray-300' : 'text-my-green'} h-4 w-4`} />
        </button>
      </div>
    </div>
  )
}