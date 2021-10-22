import { useState } from "react"
import { FOAF, DCTERMS } from "@inrupt/vocab-common-rdf";
import { getStringNoLocale, getDatetime, getUrl, setUrl, asUrl } from "@inrupt/solid-client";
import Link from 'next/link'
import { useWebId } from 'swrlit'

import { Logo } from './logo';
import Avatar from './Avatar';
import { getRelativeTime } from '../utils/time';
import { profilePath } from '../utils/uris';
import { NoteVisibilityToggle } from './toggles'
import PrivacyChanger from './PrivacyChanger'
import { UploadImage } from './icons'
import { Tooltip } from './elements'
import ImageUploadModal from './modals/ImageUpload'
import { useImageUploadUri } from "../hooks/uris";

export default function NoteHeader({ concept, saveConcept, conceptName, authorProfile, currentUserProfile, myNote, privacy }) {

  const authorName = authorProfile && getStringNoLocale(authorProfile, FOAF.name);
  const avatarImgSrc = authorProfile && getUrl(authorProfile, FOAF.img)

  const noteCreatedAt = concept && getDatetime(concept, DCTERMS.created);
  const noteLastEdit = concept && getDatetime(concept, DCTERMS.modified);

  const currentUserAvatarImgSrc = currentUserProfile && getUrl(currentUserProfile, FOAF.img)

  const [privacyUpdatingTo, setPrivacyUpdatingTo] = useState(false)
  function setNoteVisibilityEnabled(isEnabled) {
    setPrivacyUpdatingTo(isEnabled ? 'public' : 'private')
  }

  const authorWebId = authorProfile && asUrl(authorProfile)
  const coverImage = concept && getUrl(concept, FOAF.img)
  const bg = myNote ? ((privacy == 'private') ? "bg-header-gray-gradient" : "bg-header-gradient") : "bg-my-green"

  const webId = useWebId()
  const imageUploadUri = useImageUploadUri(webId)
  const [coverImageUploaderOpen, setCoverImageUploaderOpen] = useState(false)
  async function setCoverImage(url) {
    await saveConcept(setUrl(concept, FOAF.img, url))
    setCoverImageUploaderOpen(false)
  }
  const authorProfilePath = authorWebId && profilePath(authorWebId)
  return (
    <div className="flex flex-col">
      <nav className={`${bg} b-2xl flex flex-row justify-between h-32`}>
        <div className="flex flex-row">
          <div className="flex flex-row items-center">
            <div className="w-18">
              <Link href="/">
                <a>
                  <Logo className='w-12 -ml-2.5 transform scale-150 opacity-20' />
                </a>
              </Link>
            </div>
          </div>
          <div className="flex flex-row flex-col items-left">
            <div className="mt-6 text-white text-4xl font-black">{conceptName}</div>
            <div className="flex flex-row mt-3 h-3 text-sm text-white items-center">
              {authorProfilePath && (
                <>
                  <Link href={authorProfilePath}>
                    <a>
                      <Avatar src={avatarImgSrc} border={false} className="h-6 w-6" />
                    </a>
                  </Link>
                  <Link href={authorProfilePath}>
                    <a>
                      <div className="ml-2 font-bold text-my-yellow">{authorName}</div>
                    </a>
                  </Link>
                </>
              )}
              <div className="ml-2 opacity-50">
                <b>Created</b> {noteCreatedAt && getRelativeTime(noteCreatedAt)}
              </div>
              <div className="ml-2 opacity-50">
                <b>Last Edit</b> {noteLastEdit && getRelativeTime(noteLastEdit)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-6">
          <div className="flex flex-row h-10 mr-4">
            {myNote && (
              <>
                {privacyUpdatingTo ? (
                  <PrivacyChanger name={conceptName}
                    changeTo={privacyUpdatingTo} onFinished={() => setPrivacyUpdatingTo(null)} />
                ) : (
                  <NoteVisibilityToggle className="h-6 mr-8 w-20" enabled={privacy == 'public'}
                    setEnabled={setNoteVisibilityEnabled} />
                )}
              </>
            )}
            {/*
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
      <div className={`relative flex flex-row justify-center group overflow-hidden ${coverImage ? 'h-40' : ''}`}>
        {coverImage && (
          <img className="absolute top-0 left-0 w-full overflow-hidden" src={coverImage} alt={conceptName} />
        )}
        {myNote && (
          <>
            <Tooltip content={<span>Upload Cover Image</span>}>
              <button className="hover:shadow-menu" onClick={() => setCoverImageUploaderOpen(true)}>
                <UploadImage className="w-6 h-6 text-gray-700 mt-4 opacity-10 group-hover:opacity-90" />
              </button>
            </Tooltip>
            <ImageUploadModal open={coverImageUploaderOpen} setOpen={setCoverImageUploaderOpen}
              onSave={(url) => setCoverImage(url)} uploadContainerUri={imageUploadUri} />
          </>
        )}
      </div>
    </div>
  )
}