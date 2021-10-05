import { useState } from 'react'
import { Formik } from 'formik';
import { Search as SearchIcon } from './icons';
import { IconInput } from './inputs';
import { Logo } from './logo';
import Avatar from './Avatar';
import Dropdown from '../components/Dropdown';
import NewNote from '../components/modals/NewNote';
import { Dialog } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


function NewNoteModal({ isOpen, setIsOpen }) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <Dialog.Overlay className="fixed z-0 inset-0 bg-black opacity-30" />

      <NewNote />

      <button onClick={() => setIsOpen(false)}>Deactivate</button>
      <button onClick={() => setIsOpen(false)}>Cancel</button>
    </Dialog>)
}

export default function Header({ avatarImgSrc }) {
  const [showNewNote, setShowNewNote] = useState(false)
  return (
    <nav className="bg-my-green rounded-b-2xl flex flex-row justify-between h-18 items-center">
      <div className="flex flex-row items-center">
        <div className="w-18 flex flex-col justify-center items-center">
          <Logo className='w-7 transform scale-105' />
        </div>
        <Formik>
          <IconInput type="search" name="search" placeholder="Search"
            icon={<SearchIcon className="ipt-header-search-icon" />}
            inputClassName="ipt-header-search" />
        </Formik>
      </div>
      <div className="flex flex-row items-center">
        <Dropdown label="New" >
          <Dropdown.Items className="origin-top-left absolute right-0 mt-2 w-52 rounded-lg shadow-menu text-xs bg-white focus:outline-none">
            <div className="uppercase text-gray-300 text-xs mt-2.5 px-4">
              Create New
            </div>
            <Dropdown.Item>
              {({ active }) => (
                <button
                  onClick={() => setShowNewNote(true)}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Note
                </button>
              )}
            </Dropdown.Item>
          </Dropdown.Items>
        </Dropdown>
        <NewNoteModal isOpen={showNewNote} setIsOpen={setShowNewNote} />
        <Avatar src={avatarImgSrc} className="mx-12 w-12 h-12" />
      </div>
    </nav>
  )
}