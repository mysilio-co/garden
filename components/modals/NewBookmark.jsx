import { useState, useEffect } from 'react'

import { createBookmark } from 'garden-kit/items';
import { useGarden } from 'garden-kit/hooks'
import { setItemWithUUID } from 'garden-kit/garden'

import { Close as CloseIcon, TickCircle } from '../icons'
import { useWebId } from 'swrlit/contexts/authentication';
import Modal from '../Modal';
import { useOGTags } from '../../hooks/uris';
import { useGardenContext } from '../../contexts/GardenContext'

export function NewBookmark({ onClose }) {
  const webId = useWebId();
  const { url: gardenUrl } = useGardenContext()
  const { garden, save: saveGarden } = useGarden(gardenUrl)
  console.log("garden", garden, gardenUrl)
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');
  const og = useOGTags(url);

  useEffect(() => {
    if (og) {
      // OG tags were update (i.e. new URL)
      // set name, description to ogTags
      if (og && og.ogTitle) {
        setTitle(og.ogTitle);
      }
      if (og && og.ogDescription) {
        setDesc(og.ogDescription);
      }
      if (og && og.ogImage && og.ogImage.url) {
        setImg(og.ogImage.url);
      }
      if (og && og.ogUrl) {
        setUrl(og.ogUrl);
      }
    }
  }, [og]);

  const onSubmit = async () => {
    const newGarden = setItemWithUUID(garden, createBookmark(webId, url, {
      title: title,
      description: desc,
      depiction: img
    }))


    await saveGarden(newGarden);
    onClose();
  };

  return (
    <div className="mx-auto rounded-lg overflow-hidden bg-white flex flex-col items-stretch">
      <div className="flex flex-row justify-between self-stretch h-18 p-6 bg-my-green">
        <div className="flex flex-row justify-start items-start gap-4">
          <h2 className="text-white font-bold text-xl">New Bookmark</h2>
        </div>
        <CloseIcon
          className="text-white h-6 w-6 flex-grow-0 cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="divide-1 divide-gray-100">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start px-6 py-5">
          <label htmlFor="url" className="text-sm font-medium text-gray-900">
            URL
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col">
            <input
              type="url"
              name="url"
              id="url"
              className="ipt"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start px-6 py-5">
          <label className="text-sm font-medium text-gray-900">Title</label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col">
            <input
              type="text"
              name="title"
              id="title"
              className="ipt"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start px-6 py-5">
          <label className="text-sm font-medium text-gray-900">
            Description
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col">
            <textarea
              type="text"
              name="description"
              id="description"
              className="ipt"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
        <div className="h-20 bg-gray-50 flex flex-row justify-end items-center px-6">
          <button
            type="button"
            className="btn-md btn-filled btn-square h-10 mr-1"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-md btn-filled btn-square h-10 ring-my-green text-my-green flex flex-row justify-center items-center"
            onClick={onSubmit}
          >
            Create
            <TickCircle className="ml-1 text-my-green h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewBookmarkModal({ isPublic = false, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <NewBookmark onClose={onClose} />
    </Modal>
  );
}
