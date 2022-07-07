import { asUrl } from '@inrupt/solid-client/thing/thing';
import { getDatetime, getStringNoLocale } from '@inrupt/solid-client/thing/get';
import Link from 'next/link';
import { DCTERMS, FOAF } from '@inrupt/vocab-common-rdf';

import { getRelativeTime } from '../../utils/time.js';

export default function ImageCard({ image }) {
  const url = asUrl(image);
  const lastEdit = image && getDatetime(image, DCTERMS.modified);
  const title = image && getStringNoLocale(image, DCTERMS.title);

  return (
    <li className="col-span-1 bg-white rounded-lg overflow-hidden shadow-label list-none">
      <Link href={url}>
        <a target="_blank" rel="noopener noreferrer">
          <div>
            <div className="h-40 border-b-4 border-gray-300 overflow-hidden">
              <img src={url} className="object-cover h-full " />
            </div>
            <div className="h-56 flex flex-col justify-between p-6">
              <h3 className="text-gray-700 text-xl font-bold">{title}</h3>
              <p></p>
              <footer className="flex flex-row">
                <span className="text-my-green text-sm font-semibold mr-3">
                  Image
                </span>
                <span className="text-gray-300 text-sm">
                  Last Edited: {getRelativeTime(lastEdit)}
                </span>
              </footer>
            </div>
          </div>
        </a>
      </Link>
    </li>
  );
}
