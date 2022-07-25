import { asUrl } from "@inrupt/solid-client/thing/thing";
import { getUrl, getDatetime, getStringNoLocale } from "@inrupt/solid-client/thing/get";
import Image from "next/image";
import { DCTERMS, FOAF } from "@inrupt/vocab-common-rdf";
import { getAbout } from 'garden-kit/items'

import { getRelativeTime } from '../../utils/time.js';

export default function Bookmark({ link }) {
  const url = getAbout(link);
  const lastEdit = link && getDatetime(link, DCTERMS.modified);
  const title = link && getStringNoLocale(link, DCTERMS.title);
  const description = link && getStringNoLocale(link, DCTERMS.description);
  const coverImage = link && getUrl(link, FOAF.depiction);

  return (
    <li className="col-span-1 bg-white rounded-lg overflow-hidden shadow-label list-none">
      <a href={url} target="_blank">
        <div>
          <div className="h-40 border-b-4 border-gray-300 overflow-hidden">
            {coverImage ? (
              <img src={coverImage} className="object-cover h-full" />
            ) : (
              <div className="bg-gradient-to-b from-my-green to-my-dark-green">
                <Image
                  className="transform scale-150 -translate-x-16 translate-y-6 sm:translate-y-9 xl:-translate-y-2"
                  src="/note-card-splash.png"
                  width="640"
                  height="472"
                />
              </div>
            )}
          </div>
          <div className="h-56 flex flex-col justify-between p-6">
            <h3 className="text-gray-700 text-xl font-bold">{title}</h3>
            <p>{description}</p>
            <footer className="flex flex-row">
              <span className="text-my-green text-sm font-semibold mr-3">
                Bookmark
              </span>
              <span className="text-gray-300 text-sm">
                Last Edited: {getRelativeTime(lastEdit)}
              </span>
            </footer>
          </div>
        </div>
      </a>
    </li>
  );
}