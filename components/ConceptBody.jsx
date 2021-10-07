import { useState, useMemo, Fragment } from 'react';
import { Transition } from '@headlessui/react'

import NoteEditor from "./NoteEditor";
import ConnectionsPanel from "./ConnectionsPanel";
import { InlineLoader } from './elements'
import { Share as ShareIcon, ArrowSquareLeft as ArrowSquareLeftIcon } from './icons'
import { EmptySlateJSON } from "../utils/slate";

function CreateNote({ conceptName, onNoteBodyChange }) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="font-bold text-2xl">{conceptName}</h3>
      <div>does not exist but you can</div>
      <button className="btn-md btn-filled btn-square mt-8"
        onClick={() => { onNoteBodyChange(EmptySlateJSON) }}>
        Create It!
      </button>
    </div>
  )
}

export default function ConceptBody({
  concept, note, noteError, conceptPrefix, conceptIndex,
  conceptName, tagPrefix, onNoteBodyChange, conceptNames, editorId, panelStartsOpen = false,
  workspaceSlug, webId
}) {
  const [panelOpen, setPanelOpen] = useState(panelStartsOpen)
  return (

    <div className="relative">
      <Transition
        show={!panelOpen} as={Fragment}
        as={Fragment}
        enter="transform transition ease-in-out duration-500 sm:duration-700"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-500 sm:duration-700"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <button onClick={() => setPanelOpen(true)}
          className="absolute top-0 right-0 w-18 h-18 bg-gray-100 rounded-bl-lg flex flex-row py-6 pl-2 pr-4"
        >
          <ArrowSquareLeftIcon className="w-6 h-6" />
          <ShareIcon className="w-6 h-6" />
        </button>
      </Transition>

      <div className="flex flex-row w-full">
        <div className={`flex-grow py-6 bg-white ${panelOpen ? 'pl-18 pr-9' : 'px-44'}`}>
          {note ? (
            <NoteEditor editorId={editorId} note={note} onNoteBodyChange={onNoteBodyChange} conceptNames={conceptNames} />
          ) : (noteError ? (
            <CreateNote conceptName={conceptName} onNoteBodyChange={onNoteBodyChange} />
          ) : (
            <InlineLoader />
          )
          )}

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
          <ConnectionsPanel
            concept={concept} conceptName={conceptName} conceptPrefix={conceptPrefix} tagPrefix={tagPrefix}
            webId={webId} workspaceSlug={workspaceSlug} conceptIndex={conceptIndex}
            onClose={() => setPanelOpen(false)} />
        </Transition>
      </div>
    </div>
  )
}