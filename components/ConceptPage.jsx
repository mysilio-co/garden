import { useProfile, useMyProfile } from "swrlit";

import { urlSafeIdToConceptName } from "../utils/uris";
import { useConceptAndNote } from '../hooks/app';

import NoteHeader from './NoteHeader';
import ConceptEditor from './ConceptEditor';
import WebMonetization from './WebMonetization';

export default function ConceptPage({ editorId = 'concept-page', webId, workspaceSlug, slug }) {
  const conceptName = slug && urlSafeIdToConceptName(slug);
  const { concept, note, maybeSaveNoteBody, saving } = useConceptAndNote(webId, workspaceSlug, conceptName)
  const { profile: authorProfile } = useProfile(webId);
  const { profile: currentUserProfile } = useMyProfile();
  return (
    <div>
      <WebMonetization webId={webId} />
      <NoteHeader concept={concept} conceptName={conceptName} authorProfile={authorProfile}
        currentUserProfile={currentUserProfile} />
      <ConceptEditor webId={webId} workspaceSlug={workspaceSlug} slug={slug}
        concept={concept} note={note} maybeSaveNoteBody={maybeSaveNoteBody} />
    </div>
  )
}