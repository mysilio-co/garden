import { useProfile, useMyProfile } from "swrlit";

import { urlSafeIdToConceptName } from "../utils/uris";
import { useConceptAndNote } from '../hooks/app';
import { useCombinedConceptIndexDataset } from '../hooks/concepts'

import NoteHeader from './NoteHeader';
import ConceptEditor from './ConceptEditor';
import WebMonetization from './WebMonetization';

export default function ConceptPage({ editorId = 'concept-page', webId, workspaceSlug, slug }) {
  const conceptName = slug && urlSafeIdToConceptName(slug);
  const { concept, note, noteError, maybeSaveNoteBody, saving } = useConceptAndNote(webId, workspaceSlug, conceptName)
  const { profile: authorProfile } = useProfile(webId);
  const { profile: currentUserProfile } = useMyProfile();
  const { index } = useCombinedConceptIndexDataset(webId, workspaceSlug);
  return (
    <div>
      <WebMonetization webId={webId} />
      <NoteHeader concept={concept} conceptName={conceptName} authorProfile={authorProfile}
        currentUserProfile={currentUserProfile} />
      <ConceptEditor webId={webId} workspaceSlug={workspaceSlug} slug={slug}
        conceptIndex={index} concept={concept} conceptName={conceptName} editorId={conceptName}
        note={note} noteError={noteError} maybeSaveNoteBody={maybeSaveNoteBody} />
    </div>
  )
}