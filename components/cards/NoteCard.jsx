import { asUrl } from '@inrupt/solid-client/thing/thing';
import { getDatetime, getUrl } from '@inrupt/solid-client/thing/get';
import Link from "next/link";
import Image from "next/image";
import { DCTERMS, FOAF } from "@inrupt/vocab-common-rdf";
import {getTitle} from 'garden-kit/utils'

import { conceptIdFromUri } from "../../model/concept";
import { notePath, itemPath, urlSafeIdToConceptName } from "../../utils/uris";
import { getRelativeTime } from '../../utils/time';

export default function NoteCard({ concept, workspaceSlug, gardenUrl, webId }) {
  const name = getTitle(concept)
  const url = itemPath(webId, workspaceSlug, gardenUrl, name)
  const noteLastEdit = concept && getDatetime(concept, DCTERMS.modified);
  const coverImage = concept && getUrl(concept, FOAF.img)

  return (
    <li className="col-span-1 bg-white rounded-lg overflow-hidden shadow-label list-none">
      <Link href={url}>
        <a>
          <div>
            <div className="h-40 border-b-4 border-gray-300 overflow-hidden">
              {coverImage ? (
                <img src={coverImage} className="object-cover" />
              ) : (
                <div className="bg-gradient-to-b from-my-green to-my-dark-green">
                  <Image className="transform scale-150 -translate-x-16 translate-y-6 sm:translate-y-9 xl:-translate-y-2" src="/note-card-splash.png" width="640" height="472" />
                </div>
              )}
            </div>
            <div className="h-56 flex flex-col justify-between p-6">
              <h3 className="text-gray-700 text-xl font-bold">
                {name}
              </h3>
              <p>

              </p>
              <footer className="flex flex-row">
                <span className="text-my-green text-sm font-semibold mr-3">Note</span>
                <span className="text-gray-300 text-sm">Last Edited: {getRelativeTime(noteLastEdit)}</span>
              </footer>
            </div>
          </div>
        </a>
      </Link>
    </li>
  );
}