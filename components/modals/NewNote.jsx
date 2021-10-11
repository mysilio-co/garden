import { useState, Fragment } from 'react'
import { Formik } from 'formik'
import { Transition, Dialog } from '@headlessui/react';
import {
  useStoreEditorState,
  usePlateActions,
} from "@udecode/plate";
import { useWebId } from "swrlit";
import { isThingLocal } from "@inrupt/solid-client";

import { PrivacyToggle } from '../toggles'
import { Close as CloseIcon, TickCircle } from '../icons'
import { Input } from '../inputs'
import { createOrUpdateSlateJSON, saveNote } from "../../model/note";
import { createOrUpdateConceptIndex } from "../../model/concept";
import { useCurrentWorkspace } from "../../hooks/app";
import { useConcept, useConceptNames } from "../../hooks/concepts";
import NoteEditor from "../NoteEditor"
import { EmptySlateJSON } from "../../utils/slate";


export const NewNote = ({ onClose, isPublic = false }) => {
  const [pub, setPublic] = useState(isPublic)
  const [value, setNoteValue] = useState(EmptySlateJSON);

  const [createAnother, setCreateAnother] = useState(false);
  const [saving, setSaving] = useState(false);
  const editorId = "create-modal";
  const { setValue, resetEditor } = usePlateActions(editorId);

  const webId = useWebId();
  const { workspace, slug: workspaceSlug } = useCurrentWorkspace();
  const [name, setName] = useState("");

  const {
    concept,
    index: conceptIndex,
    saveIndex: saveConceptIndex,
  } = useConcept(webId, workspaceSlug, name, pub ? 'public' : 'private');
  const conceptNames = useConceptNames(webId)
  const conceptExists = concept && !isThingLocal(concept);

  const save = async function save() {
    const newNote = createOrUpdateSlateJSON(value);
    const newConceptIndex = createOrUpdateConceptIndex(
      value,
      workspace,
      conceptIndex,
      concept,
      name
    );
    setSaving(true);
    try {
      await saveConceptIndex(newConceptIndex);
      await saveNote(newNote, concept);
    } catch (e) {
      console.log("error saving note", e);
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    resetEditor();
    setValue(EmptySlateJSON);
    setName("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = () => {
    save();
    if (createAnother) {
      reset();
    } else {
      close();
    }
  };

  return (
    <div className="mx-auto rounded-lg overflow-hidden bg-white flex flex-col items-stretch">
      <div className={`flex flex-row justify-between self-stretch h-18 p-6 ${pub ? 'bg-my-green' : 'bg-gray-500'}`}>
        <div className="flex flex-row justify-start items-start gap-4">
          <h2 className="text-white font-bold text-xl">New {pub ? 'Public' : 'Private'} Note</h2>
          <PrivacyToggle enabled={pub} setEnabled={setPublic} />
        </div>
        <CloseIcon className="text-white h-6 w-6 flex-grow-0 cursor-pointer"
          onClick={onClose} />
      </div>
      <div className="divide-1 divide-gray-100">
        <Formik>
          <>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start px-6 py-5">
              <label htmlFor="name" className="text-sm font-medium text-gray-900">
                Note Name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2 flex flex-col">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={`ipt ${conceptExists ? 'error' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {conceptExists && (
                  <span className="ipt-error-message">
                    concept already exists
                  </span>
                )}
              </div>
            </div>
            <div className="px-6 py-5 h-96">
              <NoteEditor editorId={editorId} onNoteBodyChange={setNoteValue} conceptNames={conceptNames}
                editableProps={{ className: "overflow-auto h-5/6" }} />
            </div>
          </>
        </Formik>
      </div>
      <div className="h-20 bg-gray-50 flex flex-row justify-end items-center px-6">
        <button onClick={close} className="btn-md btn-filled btn-square h-10 mr-1">Cancel</button>
        <button type="submit" onClick={onSubmit}
          className="btn-md btn-filled btn-square h-10 ring-my-green text-my-green flex flex-row justify-center items-center" disabled={conceptExists}>
          Create
          <TickCircle className="ml-1 text-my-green h-4 w-4"/>
        </button>
      </div>
    </div>
  )
}


export default function NewNoteModal({ isPublic = false, conceptNames, open, onClose }) {
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
              <NewNote onClose={onClose} conceptNames={conceptNames} />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}