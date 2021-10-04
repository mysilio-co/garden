import { useRef, useEffect, useState, useCallback } from 'react'
import { useDebounce } from "use-debounce";
import equal from "fast-deep-equal/es6";
import { getUrl } from '@inrupt/solid-client';
import { useThing } from 'swrlit'

import { useWorkspace } from '../hooks/app';
import { useConcept, useConceptNames } from '../hooks/concepts';
import { urlSafeIdToConceptName } from "../utils/uris";
import { US } from '../vocab';
import { getAndParseNoteBody, createOrUpdateSlateJSON } from '../model/note'
import { createOrUpdateConceptIndex } from '../model/concept'

import ConceptBody from './ConceptBody'

function useAutosave(save) {
  const [updatedValue, setUpdatedValue] = useState()
  const [debouncedUpdatedValue] = useDebounce(updatedValue, 1500);

  // use a ref here to avoid needing to add more dependencies to the useEffect.
  // we'd like to take advantage of useEffect only running when debouncedUpdatedValue
  // changes, so we're using a ref to ensure the effect always has access to the latest
  // save function without adding the function to the dependencies
  const saveRef = useRef()
  saveRef.current = save;
  useEffect(function () {
    if (debouncedUpdatedValue) {
      saveRef.current(debouncedUpdatedValue)
    }
  },
    // !!! do not add more dependencies - this should only re-run when debouncedUpdatedValue changes !!!
    [debouncedUpdatedValue]
  )

  return { onChange: setUpdatedValue }
}

function useConceptAndNote(webId, workspaceSlug, conceptName) {
  const [saving, setSaving] = useState(false)
  const { workspace } = useWorkspace(webId, workspaceSlug)
  const {
    concept,
    index: conceptIndex,
    saveIndex: saveConceptIndex,
  } = useConcept(webId, workspaceSlug, conceptName);

  const noteStorageUri = concept && getUrl(concept, US.storedAt);
  const {
    error: noteError,
    thing: note,
    save: saveNote,
    mutate: mutateNote,
  } = useThing(noteStorageUri);

  async function maybeSaveNoteBody(newValue) {
    const noteBody = getAndParseNoteBody(note)
    if (newValue && !equal(newValue, noteBody)) {
      const newNote = createOrUpdateSlateJSON(newValue, note);
      const newConceptIndex = createOrUpdateConceptIndex(
        newValue,
        workspace,
        conceptIndex,
        concept,
        conceptName
      );
      setSaving(true);
      try {
        await saveNote(newNote);
        await saveConceptIndex(newConceptIndex);
      } catch (e) {
        console.log("error saving note", e);
      } finally {
        setSaving(false);
      }
    }
  }

  return { note, concept, maybeSaveNoteBody, saving }
}

export default function ConceptEditor({ editorId = "default", webId, workspaceSlug, slug }) {
  const { workspace } = useWorkspace(webId, workspaceSlug)
  const conceptPrefix = workspace && getUrl(workspace, US.conceptPrefix);
  const tagPrefix = workspace && getUrl(workspace, US.tagPrefix);

  const conceptName = slug && urlSafeIdToConceptName(slug);
  const { concept, note, maybeSaveNoteBody, saving } = useConceptAndNote(webId, workspaceSlug, conceptName)
  const { onChange: onNoteBodyChange } = useAutosave(maybeSaveNoteBody)

  const conceptNames = useConceptNames(webId)

  return (
    <ConceptBody editorId={editorId}
      concept={concept} note={note}
      tagPrefix={tagPrefix} conceptPrefix={conceptPrefix}
      onNoteBodyChange={onNoteBodyChange}
      conceptNames={conceptNames} />
  )
}