import { useState, useContext, useCallback, useEffect } from 'react'
import { getPlateActions } from "@udecode/plate-core";

import { useTitledGardenItem, useSpace } from 'garden-kit/hooks'
import { getNurseryFile } from 'garden-kit/spaces'
import { useWebId } from 'swrlit/contexts/authentication'

import SpaceContext from '../../contexts/SpaceContext'
import { Close as CloseIcon, TickCircle } from '../icons'
import Editor from "../Plate/Editor"
import { EmptySlateJSON } from "../../utils/slate";
import { useItemIndex } from "../../hooks/items"
import { useOGTags } from '../../hooks/uris';

const editorId = 'create-modal';

export default function NewItem({ onClose }) {
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [coverImage, setCoverImage] = useState()

  const [url, setUrl] = useState()
  const [noteValue, setNoteValue] = useState()

  // basic item loading - provides save function and ability to tell if item exists yet
  const webId = useWebId();
  const { slug: spaceSlug } = useContext(SpaceContext);
  const { space } = useSpace(webId, spaceSlug)
  const gardenUrl = getNurseryFile(space)
  const { save: saveItem } = useTitledGardenItem(gardenUrl, name);
  const { data } = useItemIndex(webId, spaceSlug)
  const { index } = data || {}
  console.log(index)
  const itemExists = !!index.name[name]

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


  // control functions
  const reset = useCallback(function reset() {
    const { value: setEditorValue, resetEditor } = getPlateActions(editorId)
    resetEditor()
    setEditorValue(EmptySlateJSON);
    setNoteValue(null)
    setName('');
  }, [])

  const save = useCallback(async function save() {
    console.log(name, url, noteValue)
  }, [name, description, coverImage, url, noteValue, saveItem])

  const onSubmit = useCallback(async function onSubmit() {
    await save();
    reset();
    onClose();
  }, [reset, save, onClose])

  const cancel = useCallback(function cancel() {
    onClose();
  }, [onClose]);

  // TODO load these from index
  const conceptNames = []

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
        </div>
        <div className="px-6 py-5 h-96">
          <Editor
            editorId={editorId}
            initialValue={EmptySlateJSON}
            conceptNames={conceptNames}
            editableProps={{ className: 'overflow-auto h-5/6' }}
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
          className="btn-md btn-filled btn-square h-10 ring-my-green text-my-green flex flex-row justify-center items-center"
          disabled={itemExists}
        >
          Create
          <TickCircle className="ml-1 text-my-green h-4 w-4" />
        </button>
      </div>
    </div>
  )
}