import { useState, useCallback } from 'react';
import { Formik } from 'formik';
import { MenuIcon } from '@heroicons/react/outline';
import { FOAF } from '@inrupt/vocab-common-rdf';
import { sioc as SIOC } from 'rdf-namespaces';
import {
  asUrl,
  getUrl,
  getStringNoLocale,
  addUrl,
  removeUrl,
} from '@inrupt/solid-client';
import Link from 'next/link';
import { useLoggedIn, useWebId } from 'swrlit/contexts/authentication';
import { useMyProfile } from 'swrlit/hooks/things';

import { profilePath } from '../utils/uris';
import { AddCircle as AddCircleIcon } from './icons';
import Avatar from './Avatar';

import NewItem from './modals/NewItem';
import { useFollows } from '../hooks/people';
import { getTitle } from 'garden-kit/utils';
import Modal from './Modal';
import Search from './Search';

function FollowUnfollowButton({ webId }) {
  const { profile: myProfile, save: saveProfile } = useMyProfile();

  const follow = useCallback(
    async function follow() {
      await saveProfile(addUrl(myProfile, SIOC.follows, webId));
    },
    [saveProfile, myProfile, webId]
  );
  const unfollow = useCallback(
    async function unfollow() {
      await saveProfile(removeUrl(myProfile, SIOC.follows, webId));
    },
    [saveProfile, myProfile, webId]
  );

  const follows = useFollows();
  const alreadyFollowing = follows && follows.includes(webId);
  return alreadyFollowing ? (
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
  );
}

function GardenAuthor({ profile }) {
  const myWebId = useWebId();
  const webId = profile && asUrl(profile);
  const isMyProfile = myWebId === webId;
  const authorProfilePath = webId && profilePath(webId);
  const avatarImgSrc = profile && getUrl(profile, FOAF.img);
  const name = profile && getStringNoLocale(profile, FOAF.name);

  return (
    <>
      <Link href={authorProfilePath}>
        <a>
          <Avatar
            src={avatarImgSrc}
            className="h-6 w-6"
            border="border border-white"
          />
        </a>
      </Link>
      <Link href={authorProfilePath}>
        <a>
          <div className="font-bold text-my-yellow">{name}</div>
        </a>
      </Link>
      {!isMyProfile && <FollowUnfollowButton webId={webId} />}
    </>
  );
}

export default function GardenHeader({
  type,
  onSearch,
  openSidebar,
  authorProfile,
  gardenSettings,
}) {
  const loggedIn = useLoggedIn();
  const bg = type === 'dashboard' ? 'bg-header-gradient' : 'bg-my-green';
  const authorName =
    authorProfile && getStringNoLocale(authorProfile, FOAF.name);
  const gardenTitle = gardenSettings && getTitle(gardenSettings);
  const headerTitle =
    type === 'dashboard'
      ? 'Community Garden'
      : authorName
      ? `${authorName}'s Profile`
      : gardenTitle
      ? `${gardenTitle} Garden`
      : '';

  const [newItemModalOpen, setNewItemModalOpen] = useState(false);
  return (
    <nav
      className={`${bg} flex flex-col sm:flex-row justify-between relative z-30 p-4 gap-4`}
    >
      <div className="flex flex-col items-left gap-2">
        <div className="flex justify-between">
          <div className="text-white text-4xl font-black">{headerTitle}</div>
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
        <Search />
        {loggedIn && (
          <>
            <button
              className="inline-flex justify-center items-center w-full rounded-full h-10 px-4 py-2 bg-white bg-opacity-10 text-sm font-medium text-white hover:bg-opacity-20 hover:shadow-btn focus:outline-none"
              onClick={() => setNewItemModalOpen(true)}
            >
              <span>New</span>
              <AddCircleIcon
                className="-mr-1 ml-2 h-4 w-4"
                aria-hidden="true"
              />
            </button>
            <Modal
              open={newItemModalOpen}
              onClose={() => setNewItemModalOpen(false)}
            >
              <NewItem onClose={() => setNewItemModalOpen(false)} />
            </Modal>
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
