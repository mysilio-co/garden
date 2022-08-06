import { useRef, useEffect, useState } from 'react'
import { useDebounce } from "use-debounce";
import { getUrl } from '@inrupt/solid-client/thing/get';

import { useWorkspace } from '../hooks/app';
import { useConcept, useConceptNames } from '../hooks/concepts';
import {useAutosave} from '../hooks/editor'
import { US } from '../vocab';



import ConceptBody from './ConceptBody'

export default function ConceptEditor({ webId, authorWebId, workspaceSlug, concept, saveConcept, conceptName, conceptIndex, note, noteError, maybeSaveNoteBody, editorId, myNote }) {
  const { workspace } = useWorkspace(authorWebId, workspaceSlug)
  const conceptPrefix = workspace && getUrl(workspace, US.conceptPrefix);
  const tagPrefix = workspace && getUrl(workspace, US.tagPrefix);
  const { onChange: onNoteBodyChange } = useAutosave(note, maybeSaveNoteBody)

  const conceptNames = useConceptNames(authorWebId)
  return (
    <ConceptBody editorId={editorId} myNote={myNote}
      concept={concept} conceptName={conceptName}
      saveConcept={saveConcept} authorWebId={authorWebId}
      note={note} noteError={noteError}
      saveNoteBody={maybeSaveNoteBody}
      tagPrefix={tagPrefix} conceptPrefix={conceptPrefix}
      onNoteBodyChange={onNoteBodyChange}
      conceptNames={conceptNames} conceptIndex={conceptIndex}
      webId={webId} workspaceSlug={workspaceSlug} />
  )
}