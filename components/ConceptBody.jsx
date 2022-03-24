import { useState, useMemo, Fragment } from 'react';
import { Transition } from '@headlessui/react'
import { FOAF, DCTERMS } from "@inrupt/vocab-common-rdf";
import {  getUrl, setUrl, asUrl } from "@inrupt/solid-client";

import NoteEditor from "./NoteEditor";
import ConnectionsPanel from "./ConnectionsPanel";
import { InlineLoader } from './elements'
import { Share as ShareIcon, ArrowSquareLeft as ArrowSquareLeftIcon } from './icons'
import { EmptySlateJSON } from "../utils/slate";
import { useImageUploadUri } from "../hooks/uris";
import { Tooltip } from './elements'
import ImageUploadModal from './modals/ImageUpload'

import { UploadImage } from './icons'

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
  concept, saveConcept, note, noteError, conceptPrefix, conceptIndex, myNote,
  conceptName, tagPrefix, onNoteBodyChange, conceptNames, editorId, panelStartsOpen = false,
  workspaceSlug, webId, authorWebId
}) {
  const [panelOpen, setPanelOpen] = useState(panelStartsOpen)
  const coverImage = concept && getUrl(concept, FOAF.img)

  const imageUploadUri = useImageUploadUri(webId)
  const [coverImageUploaderOpen, setCoverImageUploaderOpen] = useState(false)
  async function setCoverImage(url) {
    await saveConcept(setUrl(concept, FOAF.img, url))
    setCoverImageUploaderOpen(false)
  }
  return (

    <div className="relative">
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
          className="absolute top-0 right-0 w-18 h-18 bg-gray-100 rounded-bl-lg flex flex-row py-6 pl-2 pr-4 z-40"
        >
          <ArrowSquareLeftIcon className="w-6 h-6 pointer-events-none" />
          <ShareIcon className="w-6 h-6 pointer-events-none" />
        </button>
      </Transition>

      <div className="flex flex-row w-full">
        <div className={`flex-grow py-6 bg-white pl-6 sm:pl-12 md:pl-18 ${panelOpen ? 'pr-12' : 'pr-6 sm:pr-12 md:pr-18'}`}>
          {note ? (
            <div className="flex-col">
              <div className={`relative flex flex-row justify-center group overflow-hidden ${coverImage ? 'h-40' : ''}`}>
                {coverImage && (
                  <img className="absolute top-0 left-0 w-full overflow-hidden" src={coverImage} alt={conceptName} />
                )}
                {myNote && (
                  <>
                    <Tooltip content={<span>Upload Cover Image</span>}>
                      <button className="hover:shadow-menu" onClick={() => setCoverImageUploaderOpen(true)}>
                        <UploadImage className="w-6 h-6 text-gray-700 mt-4 opacity-10 group-hover:opacity-90" />
                      </button>
                    </Tooltip>
                    <ImageUploadModal open={coverImageUploaderOpen} setOpen={setCoverImageUploaderOpen}
                      onSave={(url) => setCoverImage(url)} uploadContainerUri={imageUploadUri} />
                  </>
                )}
              </div>
              <NoteEditor myNote={myNote} editorId={editorId} note={note} onNoteBodyChange={onNoteBodyChange} conceptNames={conceptNames} />
            </div>
          ) : (noteError ? (
            (webId === authorWebId) ? (
              <CreateNote conceptName={conceptName} onNoteBodyChange={onNoteBodyChange} />
            ) : (
              <div className="flex flex-col items-center">
                <h3 className="font-bold text-2xl">{conceptName}</h3>
                <div>does not exist</div>
              </div>
            )
          ) : (
            <InlineLoader />
          ))}

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
            webId={authorWebId} workspaceSlug={workspaceSlug} conceptIndex={conceptIndex}
            onClose={() => setPanelOpen(false)} />
        </Transition>
      </div>
    </div>
  )
}