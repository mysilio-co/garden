import { useState } from "react"
import { FOAF, DCTERMS } from "@inrupt/vocab-common-rdf";
import { getStringNoLocale, getDatetime, getUrl } from "@inrupt/solid-client/thing/get";
import { asUrl } from "@inrupt/solid-client/thing/thing";
import Link from 'next/link'
import { useRouter } from 'next/router'

import {
  MenuIcon,
} from '@heroicons/react/outline'

import Avatar from './Avatar';
import { getRelativeTime } from '../utils/time';
import { profilePath } from '../utils/uris';
import { NoteVisibilityToggle } from './toggles'
import PrivacyChanger from './PrivacyChanger'
import { Trashcan } from './icons'

export default function NoteHeader({ concept, deleteConcept, conceptName, authorProfile, currentUserProfile, myNote, privacy, saving, openSidebar }) {
  const router = useRouter()
  const authorName = authorProfile && getStringNoLocale(authorProfile, FOAF.name);
  const avatarImgSrc = authorProfile && getUrl(authorProfile, FOAF.img)

  const noteCreatedAt = concept && getDatetime(concept, DCTERMS.created);
  const noteLastEdit = concept && getDatetime(concept, DCTERMS.modified);

  const [privacyUpdatingTo, setPrivacyUpdatingTo] = useState(false)
  function setNoteVisibilityEnabled(isEnabled) {
    setPrivacyUpdatingTo(isEnabled ? 'public' : 'private')
  }

  const authorWebId = authorProfile && asUrl(authorProfile)
  const bg = myNote ? ((privacy == 'private') ? "bg-header-gray-gradient" : "bg-header-gradient") : "bg-my-green"

  const authorProfilePath = authorWebId && profilePath(authorWebId)
  async function deleteAndRedirect() {
    const confirmed = confirm(`Are you sure you want to delete ${conceptName}?`)
    if (confirmed) {
      await deleteConcept()
      router.push("/")
    }
  }
  return (
    <div className="flex flex-col">
      <nav className={`${bg} b-2xl flex flex-col gap-4 md:flex-row justify-between min-h-32 p-4`}>
        <div className="flex flex-col items-left">
          <div className="flex justify-between">
            <div className="text-white text-4xl font-black">
              {conceptName}
            </div>
            <button
              type="button"
              className="inline-flex md:hidden flex-shrink-0 h-12 w-12 items-center justify-center rounded-md text-gray-200 hover:text-white"
              onClick={openSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex mt-3 h-3 text-sm text-white items-center">
            {authorProfilePath && (
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <Link href={authorProfilePath}>
                  <a>
                    <Avatar src={avatarImgSrc} border={false} className="h-6 w-6" />
                  </a>
                </Link>
                <Link href={authorProfilePath}>
                  <a>
                    <div className="font-bold text-my-yellow">{authorName}</div>
                  </a>
                </Link>
              </div>
            )}
            <div className="ml-2 opacity-50 flex flex-col sm:flex-row sm:gap-2">
              <b>Created</b><span>{noteCreatedAt && getRelativeTime(noteCreatedAt)}</span>
            </div>
            <div className="ml-2 opacity-50 flex flex-col sm:flex-row sm:gap-2">
              <b>Last Edit</b><span> {noteLastEdit && getRelativeTime(noteLastEdit)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row h-10 gap-4 items-center">
            {myNote && (
              <>
                <button onClick={deleteAndRedirect} className="">
                  <Trashcan className="h-6 w-6 text-white" />
                </button>
                {privacyUpdatingTo ? (
                  <PrivacyChanger name={conceptName}
                    changeTo={privacyUpdatingTo} onFinished={() => setPrivacyUpdatingTo(null)} />
                ) : (
                  <NoteVisibilityToggle className="h-6 mr-8 w-20" enabled={privacy == 'public'}
                    setEnabled={setNoteVisibilityEnabled} />
                )}
              </>
            )}
            {saving && <div className="text-white opacity-50 text-sm">saving...</div>}
            {/*
          <button type="button" className="ml-7 inline-flex items-center p-2.5 bg-white/10 border border-white shadow-sm text-sm font-medium rounded-3xl text-white">
            <span>
              Share
            </span>
            <SendIcon className="w-4 h-4" />
          </button>
          */}
            <button
              type="button"
              className="hidden md:inline-flex lg:hidden -mr-3 h-12 w-12 items-center justify-center rounded-md text-gray-200 hover:text-white"
              onClick={openSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}