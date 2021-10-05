import { useRef, useEffect, useState } from 'react'
import { useDebounce } from "use-debounce";
import { getUrl } from '@inrupt/solid-client';

import { useWorkspace } from '../hooks/app';
import { useConcept, useConceptNames } from '../hooks/concepts';
import { US } from '../vocab';


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

export default function ConceptEditor({ editorId = "default", webId, workspaceSlug, concept, note, maybeSaveNoteBody }) {
  const { workspace } = useWorkspace(webId, workspaceSlug)
  const conceptPrefix = workspace && getUrl(workspace, US.conceptPrefix);
  const tagPrefix = workspace && getUrl(workspace, US.tagPrefix);

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