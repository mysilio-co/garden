
import { FOAF, DCTERMS } from "@inrupt/vocab-common-rdf";
import {
  getStringNoLocale,
  getDatetime,
  getUrl
} from "@inrupt/solid-client";

import { Logo } from './logo';
import Avatar from './Avatar';
import { NoteVisibilityToggle } from './toggles';
import { Send as SendIcon } from './icons';

function getRelativeTime(d1, d2 = new Date()) {
  var units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  };

  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });
  var elapsed = d1 - d2;

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (var u in units)
    if (Math.abs(elapsed) > units[u] || u == "second")
      return rtf.format(Math.round(elapsed / units[u]), u);
}

export default function NoteHeader({ concept, conceptName, authorProfile, currentUserProfile, visibility }) {

  const authorName = authorProfile && getStringNoLocale(authorProfile, FOAF.name);
  const avatarImgSrc = authorProfile && getUrl(authorProfile, FOAF.img)

  const noteCreatedAt = concept && getDatetime(concept, DCTERMS.created);
  const noteLastEdit = concept && getDatetime(concept, DCTERMS.modified);

  const currentUserAvatarImgSrc = currentUserProfile && getUrl(currentUserProfile, FOAF.img)

  return (
    <nav className="bg-my-green b-2xl flex flex-row justify-between h-32">
      <div className="flex flex-row">
        <div className="flex flex-row items-center">
          <div className="w-18">
            <Logo className='w-12 -ml-2.5 transform scale-150 opacity-20' />
          </div>
        </div>
        <div className="flex flex-row flex-col items-left">
          <div className="mt-6 text-white text-4xl font-black">{conceptName}</div>
          <div className="flex flex-row mt-2 h-3 text-sm text-white">
            <Avatar src={avatarImgSrc} className="h-6 w-6" />
            <div className="flex flex-row mt-1">
              <div className="ml-2 font-bold text-my-yellow">{authorName}</div>
              <div className="ml-2 opacity-50" text>
                <b>Created</b> {noteCreatedAt && getRelativeTime(noteCreatedAt)}
              </div>
              <div className="ml-2 opacity-50">
                <b>Last Edit</b> {noteLastEdit && getRelativeTime(noteLastEdit)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row mt-6">
        <div className="flex flex-row h-10 mr-4">
          {/*
          <NoteVisibilityToggle className="h-6 mr-8 w-20" enabled={visibility} />
          <button type="button" className="ml-7 inline-flex items-center p-2.5 bg-white-a10 border border-white shadow-sm text-sm font-medium rounded-3xl text-white">
            <span>
              Share
            </span>
            <SendIcon className="w-4 h-4" />
          </button>
          */}
          <Avatar src={currentUserAvatarImgSrc} className="h-10 w-10 ml-8" />
        </div>
      </div>
    </nav>
  )
}