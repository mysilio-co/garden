import NoteHeader from './NoteHeader';
import ConceptEditor from './ConceptEditor';

import { urlSafeIdToConceptName } from "../utils/uris";
import { useConceptAndNote } from '../hooks/app';


export default function ConceptPage({ editorId = 'concept-page', webId, workspaceSlug, slug }) {
  const conceptName = slug && urlSafeIdToConceptName(slug);
  const { concept, note, maybeSaveNoteBody, saving } = useConceptAndNote(webId, workspaceSlug, conceptName)
  return (
    <div>
      <NoteHeader />
      <ConceptEditor webId={webId} workspaceSlug={workspaceSlug} slug={slug}
        concept={concept} note={note} maybeSaveNoteBody={maybeSaveNoteBody} />
    </div>
  )
}