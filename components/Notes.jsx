import { asUrl } from "@inrupt/solid-client";
import { useWebId } from "swrlit";

import { useWorkspaceContext } from "../contexts/WorkspaceContext";


import { useConcepts } from "../hooks/concepts";

import { Loader } from './elements'
import NoteCard from "./NoteCard"

export function NotesFromConcepts({ concepts, webId, workspaceSlug }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {concepts &&
        concepts.map((concept) => (
          <NoteCard key={asUrl(concept)} concept={concept}
            webId={webId} workspaceSlug={workspaceSlug} />
        ))}
    </ul>
  );
}

export default function Notes({ }) {
  const myWebId = useWebId()
  const { slug: workspaceSlug, webId } = useWorkspaceContext()
  const { concepts } = useConcepts(webId, workspaceSlug);

  return (
    <>
      {concepts ? (concepts.length > 0 ? (
        <NotesFromConcepts webId={webId} concepts={concepts} workspaceSlug={workspaceSlug} />
      ) : (
        <div>
          <h2 className="text-2xl mb-2">
            {(myWebId === webId) ? (
              "You have no notes. Add something to your garden using the New button in the header above."
            ) : (
              `No notes.`
            )}

          </h2>
        </div>
      )) : (
        <Loader />
      )}
    </>
  );
}
