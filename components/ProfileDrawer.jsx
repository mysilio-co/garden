import { Popover } from '@headlessui/react'
import Link from 'next/link';
import { getUrl } from '@inrupt/solid-client'
import { FOAF } from '@inrupt/vocab-common-rdf';
import ProfileImage from '../components/ProfileImage'

function EllipsesMenu() {
  return (
    <div>

    </div>
  )
}

export default function ProfileDrawer({ profile, saveProfile, loggedIn, logout, isOpen, setIsOpen }) {
  const avatarImgSrc = profile && getUrl(profile, FOAF.img);
  console.log("AV", avatarImgSrc)
  return (
    <div className={`shadow-label transform top-0 right-0 w-96 px-6 pt-24 bg-white fixed z-10 h-full overflow-auto ease-in-out transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-between mb-36">
        <div className="">
          <ProfileImage
            profile={profile}
            saveProfile={saveProfile}
            className="w-32 h-32"
          />
        </div>
        <div className="flex justify-end">
          <Popover>
            <Popover.Button className="outline-none focus:outline-none">
              <button className="rounded-full border h-8 w-8">...</button>
            </Popover.Button>

            <Popover.Panel className="absolute origin-top-right right-4 z-40 rounded-md overflow-hidden shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              {loggedIn && (
                <>
                  <Link href="/profile">
                    <a className="menu-item">edit profile</a>
                  </Link>
                  <Link href="/settings">
                    <a className="menu-item">settings</a>
                  </Link>
                </>
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
          <button className="rounded-full border h-8 w-8 ml-2" onClick={() => setIsOpen(false)}>x</button>
        </div>

      </div>
      <div>
      </div>
    </div>
  )
}