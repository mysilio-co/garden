import { useState, useCallback } from 'react';
import { Formik } from 'formik';
import {
  MenuIcon,
} from '@heroicons/react/outline'
import { FOAF } from "@inrupt/vocab-common-rdf";
import { sioc as SIOC } from 'rdf-namespaces'
import { asUrl, getUrl, getStringNoLocale, addUrl, removeUrl } from '@inrupt/solid-client'
import Link from 'next/link'
import { useLoggedIn, useWebId, useMyProfile } from 'swrlit'

import { classNames } from '../utils/html';
import { profilePath } from '../utils/uris';
import { Search as SearchIcon } from './icons';
import { IconInput } from './inputs';
import Avatar from './Avatar';
import Dropdown from './Dropdown';
import NewNoteModal from './modals/NewNote';
import NewBookmarkModal from './modals/NewBookmark';
import NewImageModal from './modals/NewImage';
import NewFileModal from './modals/NewFile';
import NewNewsletterModal from './modals/NewNewsletter';
import { IsPreviewEnv } from '../model/flags';
import { useFollows } from '../hooks/people'


const ActiveModalTitles = IsPreviewEnv
  ? ['Note', 'Bookmark', 'Image', 'File', 'Newsletter']
  : ['Note', 'Bookmark', 'Image', 'File'];

function ActiveModal({ title, open, onClose }) {
  const [name, setName] = useState('');
  switch (title) {
    case 'Note':
      return (
        <NewNoteModal
          open={open}
          onClose={onClose}
          name={name}
          setName={setName}
        />
      );
    case 'Bookmark':
      return <NewBookmarkModal open={open} onClose={onClose} />;
    case 'File':
      return <NewFileModal open={open} onClose={onClose} />;
    case 'Image':
      return <NewImageModal open={open} onClose={onClose} />;
    case 'Newsletter':
      return <NewNewsletterModal open={open} onClose={onClose} />;
    case undefined:
      return <></>;
    default:
      throw new Error(`Unknown ActiveModal: ${title}`);
  }
}

function FollowUnfollowButton({ webId }) {
  const { profile: myProfile, save: saveProfile } = useMyProfile()

  const follow = useCallback(async function follow() {
    await saveProfile(addUrl(myProfile, SIOC.follows, webId))
  }, [saveProfile, myProfile, webId])
  const unfollow = useCallback(async function unfollow() {
    await saveProfile(removeUrl(myProfile, SIOC.follows, webId))
  }, [saveProfile, myProfile, webId])

  const follows = useFollows()
  const alreadyFollowing = follows && follows.includes(webId)
  return (alreadyFollowing ? (
    <button
      className="btn-sm btn-transparent btn-square font-medium"
      onClick={unfollow}
    >
      Unfollow
    </button>
  ) : (
    <button
      className="btn-sm btn-transparent btn-square font-medium"
      onClick={follow}
    >
      Follow
    </button>
  ))
}

function GardenAuthor({ profile }) {
  const myWebId = useWebId()
  const webId = profile && asUrl(profile)
  const isMyProfile = (myWebId === webId)
  const authorProfilePath = webId && profilePath(webId)
  const avatarImgSrc = profile && getUrl(profile, FOAF.img)
  const name = profile && getStringNoLocale(profile, FOAF.name);

  return (
    <>
      <Link href={authorProfilePath}>
        <a>
          <Avatar src={avatarImgSrc} className="h-6 w-6" border="border border-white" />
        </a>
      </Link>
      <Link href={authorProfilePath}>
        <a>
          <div className="font-bold text-my-yellow">{name}</div>
        </a>
      </Link>
      {!isMyProfile &&
        (<FollowUnfollowButton webId={webId} />)
      }
    </>
  )
}

export default function GardenHeader({
  type,
  onSearch,
  openSidebar,
  authorProfile
}) {
  const loggedIn = useLoggedIn()
  const [activeModal, setActiveModal] = useState(undefined);
  const bg = (type == 'dashboard') ? 'bg-header-gradient' : 'bg-my-green';
  const authorName = authorProfile && getStringNoLocale(authorProfile, FOAF.name);
  const gardenName = (type == 'dashboard') ? 'Dashboard' : `${authorName}'s garden`;



  return (
    <nav className={`${bg} flex flex-col sm:flex-row justify-between relative z-30 p-4 gap-4`}>
      <div className="flex flex-col items-left gap-2">
        <div className="flex justify-between">
          <div className="text-white text-4xl font-black">
            {gardenName}
          </div>
          <button
            type="button"
            className="inline-flex sm:hidden flex-shrink-0 h-12 w-12 items-center justify-center rounded-md text-gray-200 hover:text-white"
            onClick={openSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {loggedIn && authorProfile && (
          <div className="flex flex-row mt-3 h-3 gap-2 text-sm text-white items-center">
            <GardenAuthor profile={authorProfile} />
          </div>
        )}
      </div>
      <div className="flex flex-row items-center gap-2 self-start">
        <Formik>
          <IconInput
            type="search"
            name="search"
            placeholder="Search"
            icon={<SearchIcon className="ipt-header-search-icon" />}
            inputClassName="ipt-header-search"
            onChange={(e) => {
              e.preventDefault();
              onSearch(e.target.value);
            }}
          />
        </Formik>
        {loggedIn && (
          <>
            <Dropdown label="New">
              <Dropdown.Items className="origin-top-left absolute right-0 mt-2 w-52 rounded-lg overflow-hidden shadow-menu text-xs bg-white focus:outline-none z-40">
                <div className="uppercase text-gray-300 text-xs mt-2.5 px-4">
                  Create New
                </div>
                {ActiveModalTitles.map((title) => {
                  return (
                    <Dropdown.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          key={title}
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'menu-item'
                          )}
                          onClick={() => setActiveModal(title)}
                        >
                          {title}
                        </a>
                      )}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Items>
            </Dropdown>
            <ActiveModal
              title={activeModal}
              open={!!activeModal}
              onClose={() => setActiveModal(undefined)}
            />
          </>
        )}
        <button
          type="button"
          className="hidden sm:inline-flex lg:hidden flex-shrink-0 h-12 w-12 items-center justify-center rounded-md text-gray-200 hover:text-white"
          onClick={openSidebar}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
