import { useState } from 'react';
import { Formik } from 'formik';
import { getUrl } from '@inrupt/solid-client'
import { FOAF } from '@inrupt/vocab-common-rdf';
import Link from 'next/link';

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
import NewNewsletterModal from './modals/NewNewsletter';
import { isPreviewEnv } from '../model/flags';

const ActiveModalTitles = isPreviewEnv()
  ? ['Note', 'Bookmark', 'Image', 'File', 'Newsletter']
  : ['Note', 'Bookmark', 'Image', 'File'];

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
    case 'Newsletter':
      return <NewNewsletterModal open={open} onClose={onClose} />;
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
  drawerOpen,
  setDrawerOpen
}) {
  const avatarImgSrc = profile && getUrl(profile, FOAF.img);
  const [activeModal, setActiveModal] = useState(undefined);
  const bg = (type == 'dashboard') ? 'bg-header-gradient' : 'bg-my-green';

  return (
    <nav
      className={`${bg} rounded-b-2xl flex flex-row justify-between h-18 items-center relative z-30`}
    >
      <div className="flex flex-row items-center">
        <div className="w-18 flex flex-col justify-center items-center">
          <Link href="/">
            <a className="flex items-center p-2 rounded hover:bg-lagoon-dark hover:no-underline">
              <Logo className="w-7 transform scale-105" />
            </a>
          </Link>
        </div>
        {loggedIn && (
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
        )}
      </div>
      <div className="flex flex-row items-center">
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
          conceptNames={conceptNames}
        />

        <Avatar
          src={avatarImgSrc}
          className="mx-12 w-12 h-12 cursor-pointer"
          onClick={() => setDrawerOpen(!drawerOpen)}
        />

      </div>
    </nav>
  );
}
