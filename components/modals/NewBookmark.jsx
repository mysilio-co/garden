import { useState, Fragment } from 'react'
import { Transition, Dialog } from '@headlessui/react';
import { Formik, Field, Form } from "formik";
import { Close as CloseIcon, TickCircle } from '../icons'
import { useConceptIndex } from '../../hooks/concepts';
import { useWebId } from 'swrlit';
import { addLinkToIndex } from '../../model/index';
import Modal from '../Modal';

export function NewBookmark({ onClose }) {
  const webId = useWebId()
  const { index, save } = useConceptIndex(webId);

  const initialValues = { url: '' };
  const onSubmit = async ({ url }) => {
    const newIndex = addLinkToIndex(index, url);
    await save(newIndex);
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
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <Form>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start px-6 py-5">
              <label
                htmlFor="url"
                className="text-sm font-medium text-gray-900"
              >
                URL
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col">
                <Field type="url" name="url" id="url" className="ipt" />
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
              >
                Create
                <TickCircle className="ml-1 text-my-green h-4 w-4" />
              </button>
            </div>
          </Form>
        </Formik>
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