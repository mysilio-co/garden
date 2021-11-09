import { useState } from 'react';
import { Formik } from 'formik';
import { getUrl } from '@inrupt/solid-client'
import { FOAF } from '@inrupt/vocab-common-rdf';
import Link from 'next/link';
import { Popover } from '@headlessui/react'

import { classNames } from '../utils/html';
import { Search as SearchIcon } from './icons';
import { IconInput } from './inputs';
import { Logo } from './logo';
import Avatar from './Avatar';
import Dropdown from './Dropdown';
import NewNoteModal from './modals/NewNote';
import NewBookmarkModal from './modals/NewBookmark';
import NewImageModal from './modals/NewImage';
import NewFileModal from './modals/NewFile';
import { isPreviewEnv } from '../model/flags';

function ActiveModal({ title, open, onClose, conceptNames }) {
  switch (title) {
    case 'Note':
      return (
        <NewNoteModal
          open={open}
          onClose={onClose}
          conceptNames={conceptNames}
        />
      );
    case 'Bookmark':
      return <NewBookmarkModal open={open} onClose={onClose} />;
    case 'File':
      return <NewFileModal open={open} onClose={onClose} />;
    case 'Image':
      return <NewImageModal open={open} onClose={onClose} />;
    case undefined:
      return <></>;
    default:
      throw new Error(`Unknown ActiveModal: ${title}`);
  }
}

export default function Header({
  profile,
  loggedIn,
  logout,
  conceptNames,
  type,
  onSearch,
}) {
  const avatarImgSrc = profile && getUrl(profile, FOAF.img);
  const [activeModal, setActiveModal] = useState(undefined);
  const bg = (type == 'dashboard') ? 'bg-header-gradient' : 'bg-my-green';

  return (
    <nav
      className={`${bg} rounded-b-2xl flex flex-row justify-between h-18 items-center`}
    >
      <div className="flex flex-row items-center">
        <div className="w-18 flex flex-col justify-center items-center">
          <Link href="/">
            <a className="flex items-center p-2 rounded hover:bg-lagoon-dark hover:no-underline">
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
            onChange={(e) => {
              e.preventDefault();
              onSearch(e.target.value);
            }}
          />
        </Formik>
      </div>
      <div className="flex flex-row items-center">
        <Dropdown label="New">
          <Dropdown.Items className="origin-top-left absolute right-0 mt-2 w-52 rounded-lg overflow-hidden shadow-menu text-xs bg-white focus:outline-none z-40">
            <div className="uppercase text-gray-300 text-xs mt-2.5 px-4">
              Create New
            </div>
            {['Note', 'Bookmark', 'Image', 'File'].map((title) => {
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
          conceptNames={conceptNames}
        />
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
