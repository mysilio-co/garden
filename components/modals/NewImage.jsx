import { useState, Fragment } from 'react'
import { Formik, Field, Form } from "formik";
import { Transition, Dialog } from '@headlessui/react';
import { Close as CloseIcon, TickCircle } from '../icons'
import * as Yup from "yup";
import { useConceptIndex } from '../../hooks/concepts';
import { useImageUploadUri } from '../../hooks/uris';
import { useWebId } from 'swrlit';
import { addImageToIndex } from '../../model';
import { ImageUploadAndEditor } from '../../components/ImageUploader';

export function NewImage({ onClose }) {
  const webId = useWebId();
  const { index, save } = useConceptIndex(webId);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [file, setFile] = useState(undefined);

  const onSubmit = () => {
    const newIndex = addImageToIndex(index, imageUrl, file);
    save(newIndex);
    onClose();
  };

  const onSave = (url, file) => {
    setImageUrl(url);
    setFile(file);
  };

  const imageUploadUri = useImageUploadUri(webId);

  return (
    <div className="mx-auto rounded-lg overflow-hidden bg-white flex flex-col items-stretch">
      <div className="flex flex-row justify-between self-stretch h-18 p-6 bg-my-green">
        <div className="flex flex-row justify-start items-start gap-4">
          <h2 className="text-white font-bold text-xl">New Upload</h2>
        </div>
        <CloseIcon
          className="text-white h-6 w-6 flex-grow-0 cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="divide-1 divide-gray-100">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start px-6 py-5">
          <label htmlFor="file" className="text-sm font-medium text-gray-900">
            Upload an Image
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col">
            {!imageUrl ? (
              <ImageUploadAndEditor
                onSave={onSave}
                imageUploadContainerUri={imageUploadUri}
              />
            ) : (
              <img src={imageUrl} />
            )}
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
            onSubmit={onSubmit}
          >
            Create
            <TickCircle className="ml-1 text-my-green h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewImageModal({ isPublic = false, open, onClose }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        onClose={onClose}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-end justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-20 hams transition-opacity backdrop-filter backdrop-blur-lg" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-full sm:w-5/6">
              <NewImage onClose={onClose} />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}