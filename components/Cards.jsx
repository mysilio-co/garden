import { asUrl } from "@inrupt/solid-client/thing/thing";
import { useWebId } from "swrlit";
import { Loader } from './elements'
import NoteCard from "./cards/NoteCard"
import ImageCard from "./cards/ImageCard"
import FileCard from "./cards/FileCard"
import BookmarkCard from './cards/BookmarkCard';

import {
  isConcept,
  isBookmarkedLink,
  isBookmarkedImage,
  isBookmarkedFile,
} from '../utils/rdf';

export function CardsFromGarden({ garden, webId, workspaceSlug }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {garden &&
        garden.map((thing) => {
          if (isConcept(thing)) {
            return (
              <NoteCard
                key={asUrl(thing)}
                concept={thing}
                webId={webId}
                workspaceSlug={workspaceSlug}
              />
            );
          } else if (isBookmarkedImage(thing)) {
            return <ImageCard key={asUrl(thing)} image={thing} />;
          } else if (isBookmarkedFile(thing)) {
            return <FileCard key={asUrl(thing)} file={thing} />;
          } else if (isBookmarkedLink(thing))
            return <BookmarkCard key={asUrl(thing)} link={thing} />;
        })}
    </ul>
  );
}

export default function Cards({ workspaceSlug, webId, garden }) {
  const myWebId = useWebId();

  return (
    <>
      {garden ? (
        garden.length > 0 ? (
          <CardsFromGarden
            webId={webId}
            garden={garden}
            workspaceSlug={workspaceSlug}
          />
        ) : (
          <div>
            <h2 className="text-2xl mb-2">
              {myWebId === webId
                ? 'You have nothing in your garden yet. Add something using the New button in the header above.'
                : `This garden is empty.`}
            </h2>
          </div>
        )
      ) : (
        <Loader />
      )}
    </>
  );
}
