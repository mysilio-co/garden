import { useState } from 'react'
import { Formik } from 'formik';
import { getUrl } from '@inrupt/solid-client'
import { FOAF } from '@inrupt/vocab-common-rdf'
import Link from 'next/link';
import { Popover } from '@headlessui/react'

import { Search as SearchIcon } from './icons';
import { IconInput } from './inputs';
import { Logo } from './logo';
import Avatar from './Avatar';
import Dropdown from './Dropdown';
import NewNoteModal from './modals/NewNote';
import { classNames } from '../utils/html'

export default function Header({ profile, loggedIn, logout, conceptNames }) {
  const avatarImgSrc = profile && getUrl(profile, FOAF.img)
  const [showNewNote, setShowNewNote] = useState(false)
  return (
    <nav className="bg-my-green rounded-b-2xl flex flex-row justify-between h-18 items-center">
      <div className="flex flex-row items-center">
        <div className="w-18 flex flex-col justify-center items-center">
          <Link href="/">
            <a>
              <Logo className="w-7 transform scale-105" />
            </a>
          </Link>
        </div>
        <Formik>
          <IconInput
            type="search"
            name="search"
            placeholder="Search"
            icon={<SearchIcon className="ipt-header-search-icon" />}
            inputClassName="ipt-header-search"
          />
        </Formik>
      </div>
      <div className="flex flex-row items-center">
        <Dropdown label="New" >
          <Dropdown.Items className="origin-top-left absolute right-0 mt-2 w-52 rounded-lg overflow-hidden shadow-menu text-xs bg-white focus:outline-none z-40">
            <div className="uppercase text-gray-300 text-xs mt-2.5 px-4">
              Create New
            </div>
            <Dropdown.Item>
              {({ active }) => (
                <button
                  onClick={() => setShowNewNote(true)}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'menu-item'
                  )}
                >
                  Note
                </button>
              )}
            </Dropdown.Item>
          </Dropdown.Items>
        </Dropdown>
        <NewNoteModal open={showNewNote} setOpen={setShowNewNote} conceptNames={conceptNames} />
        <Popover>
          <Popover.Button className="outline-none focus:outline-none">
            <Avatar
              src={avatarImgSrc}
              className="mx-12 w-12 h-12 cursor-pointer"
            />
          </Popover.Button>

          <Popover.Panel className="absolute origin-top-right right-4 z-40 rounded-md overflow-hidden shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <Link href="/profile">
              <a className="menu-item">edit profile</a>
            </Link>
            <Link href="/settings">
              <a className="menu-item">settings</a>
            </Link>
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
      </div>
    </nav>
  );
}