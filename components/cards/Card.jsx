import Image from 'next/image';
import { useProfile } from 'swrlit';
import { getRelativeTime } from '../../utils/time.js';
import { getStringNoLocale, getUrl } from '@inrupt/solid-client';
import { FOAF } from '@inrupt/vocab-common-rdf';
import Avatar from '../Avatar';
import Link from 'next/link.js';
import { useWebId } from 'swrlit/contexts/authentication';

export default function Card({
  title,
  description,
  depiction,
  creator,
  lastEdit,
  href,
}) {
  const { profile } = useProfile(creator);
  const name = profile && getStringNoLocale(profile, FOAF.name);
  const avatarImgSrc = profile && getUrl(profile, FOAF.img);

  return (
    <li className="col-span-1 bg-white rounded-lg overflow-hidden shadow-label list-none">
      <Link href={href}>
        <a>
          <div>
            <div className="h-40 border-b-4 border-gray-300 overflow-hidden">
              {depiction ? (
                <img src={depiction} className="object-cover h-full" />
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
            <div className="h-56 flex flex-col justify-between p-6 pt-2">
              <div>
                <h3 className="text-gray-700 text-xl font-bold">{title}</h3>
                {creator && (
                  <div className="flex flex-col sm:flex-row sm:gap-2 pt-1">
                    <Avatar
                      src={avatarImgSrc}
                      border={false}
                      className="h-5 w-5"
                    />
                    <div className="text-my-yellow text-sm">{name}</div>
                  </div>
                )}
              </div>
              <p>{description}</p>
              <footer className="flex flex-row">
                <span className="text-my-green text-sm font-semibold mr-3">
                  Note
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