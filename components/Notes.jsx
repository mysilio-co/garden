import { useContext } from "react";
import {
  setStringNoLocale,
  getStringNoLocale,
  getUrl,
  setUrl,
  createSolid,
  getThingAll,
  asUrl,
  getDatetime,
} from "@inrupt/solid-client";
import Link from "next/link";
import { DCTERMS } from "@inrupt/vocab-common-rdf";
import { useWorkspaceContext } from "../contexts/WorkspaceContext";

import { conceptIdFromUri } from "../model/concept";
import { useConcepts } from "../hooks/concepts";
import NoteContext from "../contexts/NoteContext";
import { notePath, urlSafeIdToConceptName } from "../utils/uris";

export function Note({ concept }) {
  const uri = asUrl(concept);
  const id = conceptIdFromUri(uri);
  const name = urlSafeIdToConceptName(id);
  const { slug: workspaceSlug, webId } = useWorkspaceContext()

  return (
    <li className="col-span-1 bg-mist rounded-lg shadow overflow-x-auto">
      <Link href={notePath(webId, workspaceSlug, name)}>
        <a>
          <div className="w-full flex flex-col items-center justify-between p-6">
            <h3 className="text-lagoon text-xl font-medium truncate text-center">
              {name}
            </h3>
          </div>
        </a>
      </Link>
    </li>
  );
}

export function NotesFromConcepts({ concepts }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {concepts &&
        concepts.map((concept) => (
          <Note key={asUrl(concept)} concept={concept} />
        ))}
    </ul>
  );
}

export default function Notes({ }) {
  const { slug: workspaceSlug, webId } = useWorkspaceContext()
  const { concepts } = useConcepts(webId, workspaceSlug);
  return (
    <>
      {concepts && concepts.length > 0 ? (
        <NotesFromConcepts webId={webId} concepts={concepts} workspaceSlug={workspaceSlug} />
      ) : (
        <div>
          <h2 className="text-2xl mb-2">
            Add something to your garden using the Create menu above ^^
          </h2>
        </div>
      )}
    </>
  );
}
