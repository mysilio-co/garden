import { asUrl } from "@inrupt/solid-client";

import { useWorkspaceContext } from "../contexts/WorkspaceContext";


import { useConcepts } from "../hooks/concepts";

import { Loader } from './elements'
import NoteCard from "./NoteCard"

export function NotesFromConcepts({ concepts, webId, workspaceSlug }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {concepts &&
        concepts.map((concept) => (
          <NoteCard key={asUrl(concept)} concept={concept}
                    webId={webId} workspaceSlug={workspaceSlug}/>
        ))}
    </ul>
  );
}

export default function Notes({ }) {
  const { slug: workspaceSlug, webId } = useWorkspaceContext()
  const { concepts } = useConcepts(webId, workspaceSlug);

  return (
    <>
      {concepts ? (concepts.length > 0 ? (
        <NotesFromConcepts webId={webId} concepts={concepts} workspaceSlug={workspaceSlug} />
      ) : (
        <div>
          <h2 className="text-2xl mb-2">
            Add something to your garden using the Create menu above ^^
          </h2>
        </div>
      )) : (
        <Loader />
      )}
    </>
  );
}
