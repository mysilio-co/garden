import { Popover } from '@headlessui/react'
import Link from 'next/link';
import { asUrl } from '@inrupt/solid-client'
import { FOAF } from '@inrupt/vocab-common-rdf';
import ProfileImage from './ProfileDrawer/Image'
import Name from './ProfileDrawer/Name'
import WebMonetizationPointer from './ProfileDrawer/WebMonetizationPointer'
import { profilePath } from '../utils/uris'
import { Close, ExternalLinkIcon } from './icons'

function EllipsesMenu({ loggedIn, logout }) {
  return (
    <Popover>
      <Popover.Button className="outline-none focus:outline-none">
        <button className="rounded-full border h-8 w-8 text-gray-200">
          <span className="align-top relative -top-1">...</span>
        </button>
      </Popover.Button>

      <Popover.Panel className="absolute origin-top-right right-4 z-40 rounded-md overflow-hidden shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        {loggedIn && (
          <Link href="/settings">
            <a className="menu-item">settings</a>
          </Link>
        )}
        <a href="/privacy" className="menu-item" role="menuitem">
          privacy
        </a>
        <a href="/tos" className="menu-item" role="menuitem">
          terms of service
        </a>
        {loggedIn && (
          <button
            type="submit"
            className="menu-item"
            role="menuitem"
            onClick={logout}
          >
            log out
          </button>
        )}
      </Popover.Panel>
    </Popover>
  )
}

export default function ProfileDrawer({ profile, saveProfile, loggedIn, logout, setIsOpen }) {
  return (
    <div className="text-gray-200">
      <div className="flex justify-between mb-12">
        {profile && (
          <div className="">
            <ProfileImage
              profile={profile}
              saveProfile={saveProfile}
            />
          </div>
        )}
        <div className="flex justify-end">
          <EllipsesMenu loggedIn={loggedIn} logout={logout} />
          <button className="rounded-full border h-8 w-8 ml-2" onClick={() => setIsOpen(false)}>
            <Close className="w-5 h-5 m-auto" />
          </button>
        </div>
      </div>
      {profile && (
        <Link href={`${profilePath(asUrl(profile))}`}>
          <a className="text-purple-300">
            public profile <ExternalLinkIcon className="w-4 h-4 inline" />
          </a>
        </Link>
      )}
      <Name profile={profile} saveProfile={saveProfile} className="my-2" />
      <WebMonetizationPointer profile={profile} saveProfile={saveProfile} className="my-2" />
    </div>
  )
}