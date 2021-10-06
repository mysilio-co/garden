import { useState, Fragment } from 'react'
import { Formik } from 'formik'
import { Transition, Dialog } from '@headlessui/react';

import { PrivacyToggle } from '../toggles'
import { Close as CloseIcon } from '../icons'
import { Input } from '../inputs'

import NoteEditor from "../NoteEditor"

export const NewNote = ({ setOpen, conceptNames, isPublic = false }) => {
  const [pub, setPublic] = useState(isPublic)
  const [noteValue, setNoteValue] = useState()
  return (
    <div className="mx-auto rounded-lg overflow-hidden bg-white flex flex-col items-stretch">
      <div className={`flex flex-row justify-between self-stretch h-18 p-6 ${pub ? 'bg-my-green' : 'bg-gray-500'}`}>
        <div className="flex flex-row justify-start items-start gap-4">
          <h2 className="text-white font-bold text-xl">New {pub ? 'Public' : 'Private'} Note</h2>
          <PrivacyToggle enabled={pub} setEnabled={setPublic} />
        </div>
        <CloseIcon className="text-white h-6 w-6 flex-grow-0 cursor-pointer"
          onClick={() => setOpen && setOpen(false)} />
      </div>
      <div className="divide-1 divide-gray-100">
        <Formik>
          <>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start px-6 py-5">
              <label htmlFor="name" className="text-sm font-medium text-gray-900">
                Note Name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <Input
                  type="text"
                  name="name"
                  id="name"
                  className=""
                />
              </div>
            </div>
            <div className="px-6 py-5 h-96">
              <NoteEditor editorId="new-note" onNoteBodyChange={setNoteValue} conceptNames={conceptNames}
              editableProps={{className: "overflow-scroll h-5/6"}} />
            </div>
          </>
        </Formik>
      </div>
      <div className="h-20 bg-gray-50">

      </div>
    </div>
  )
}


export default function NewNoteModal({ isPublic = false, conceptNames, open, setOpen }) {
  return (
    <Transition.Root show={open} as={Fragment}>

      <Dialog as="div" onClose={() => setOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
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

              <NewNote setOpen={setOpen} conceptNames={conceptNames} />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}