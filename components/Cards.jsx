import { asUrl } from "@inrupt/solid-client";
import { useWebId } from "swrlit";
import { useWorkspaceContext } from "../contexts/WorkspaceContext";
import { useConcepts } from "../hooks/concepts";
import { Loader } from './elements'
import NoteCard from "./NoteCard"
import { hasNote } from "../model/concept"

export function CardsFromConcepts({ concepts, webId, workspaceSlug }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {concepts &&
        concepts.map((concept) => {
          if (hasNote(concept)) {
            <NoteCard
              key={asUrl(concept)}
              concept={concept}
              webId={webId}
              workspaceSlug={workspaceSlug}
            />;
          }
        })}
    </ul>
  );
}

export default function Cards({ }) {
  const myWebId = useWebId()
  const { slug: workspaceSlug, webId } = useWorkspaceContext()
  const { concepts } = useConcepts(webId, workspaceSlug);

  return (
    <>
      {concepts ? (concepts.length > 0 ? (
        <CardsFromConcepts webId={webId} concepts={concepts} workspaceSlug={workspaceSlug} />
      ) : (
        <div>
          <h2 className="text-2xl mb-2">
            {(myWebId === webId) ? (
              "You have nothing in your garden yet. Add something using the New button in the header above."
            ) : (
              `This garden is empty.`
            )}

          </h2>
        </div>
      )) : (
        <Loader />
      )}
    </>
  );
}
