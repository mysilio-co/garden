import { useMemo } from 'react'
import Head from 'next/head'

import { useProfile, useMyProfile, useWebId } from "swrlit";

import { urlSafeIdToConceptName } from "../utils/uris";
import { useConceptAndNote } from '../hooks/app';
import { useCombinedWorkspaceIndexDataset } from '../hooks/concepts'

import LeftNavLayout from './LeftNavLayout'
import NoteHeader from './NoteHeader';
import ConceptEditor from './ConceptEditor';
import WebMonetization from './WebMonetization';

export default function ConceptPage({ editorId = 'concept-page', webId, workspaceSlug, slug }) {
  const myWebId = useWebId()
  const conceptName = slug && urlSafeIdToConceptName(slug);
  const { concept, saveConcept, note, noteError, maybeSaveNoteBody, deleteConcept, saving, privacy } = useConceptAndNote(webId, workspaceSlug, conceptName)
  const { profile: authorProfile } = useProfile(webId);
  const { profile: currentUserProfile } = useMyProfile();
  const { index } = useCombinedWorkspaceIndexDataset(webId, workspaceSlug);
  const myNote = (webId === myWebId)
  const headerProps = useMemo(() => ({
    concept, saveConcept, conceptName, authorProfile,
    currentUserProfile, myNote, privacy, deleteConcept
  }), [
    concept, saveConcept, conceptName, authorProfile,
    currentUserProfile, myNote, privacy, deleteConcept
  ])
  return (
    <LeftNavLayout pageName={conceptName} HeaderComponent={NoteHeader} headerProps={headerProps} >
      <Head>
        <title>{conceptName}</title>
      </Head>
      <WebMonetization webId={webId} />
      <ConceptEditor webId={webId} authorWebId={webId} workspaceSlug={workspaceSlug} slug={slug} myNote={myNote}
        conceptIndex={index} concept={concept} conceptName={conceptName} editorId={conceptName}
        note={note} noteError={noteError} maybeSaveNoteBody={maybeSaveNoteBody} />
    </LeftNavLayout>
  )
}