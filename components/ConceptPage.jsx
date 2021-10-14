import { useProfile, useMyProfile, useWebId } from "swrlit";

import { urlSafeIdToConceptName } from "../utils/uris";
import { useConceptAndNote } from '../hooks/app';
import { useCombinedConceptIndexDataset } from '../hooks/concepts'

import NoteHeader from './NoteHeader';
import ConceptEditor from './ConceptEditor';
import WebMonetization from './WebMonetization';

export default function ConceptPage({ editorId = 'concept-page', webId, workspaceSlug, slug }) {
  const myWebId = useWebId()
  const conceptName = slug && urlSafeIdToConceptName(slug);
  const { concept, note, noteError, maybeSaveNoteBody, saving, privacy} = useConceptAndNote(webId, workspaceSlug, conceptName)
  const { profile: authorProfile } = useProfile(webId);
  const { profile: currentUserProfile } = useMyProfile();
  const { index } = useCombinedConceptIndexDataset(webId, workspaceSlug);
  const myNote = (webId === myWebId)
  return (
    <div>
      <WebMonetization webId={webId} />
      <NoteHeader concept={concept} conceptName={conceptName} authorProfile={authorProfile}
        currentUserProfile={currentUserProfile} myNote={myNote} privacy={privacy}/>
      <ConceptEditor webId={webId} workspaceSlug={workspaceSlug} slug={slug} myNote={myNote}
        conceptIndex={index} concept={concept} conceptName={conceptName} editorId={conceptName}
        note={note} noteError={noteError} maybeSaveNoteBody={maybeSaveNoteBody} />
    </div>
  )
}