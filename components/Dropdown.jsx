import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { AddCircle as AddCircleIcon } from './icons';

export default function Dropdown({ children, label, className }) {
  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <div>
        <Menu.Button className="inline-flex justify-center items-center w-full rounded-full h-10 px-4 py-2 bg-white bg-opacity-10 text-sm font-medium text-white hover:bg-opacity-20 hover:shadow-btn focus:outline-none">
          <span>{label}</span>
          <AddCircleIcon className="-mr-1 ml-2 h-4 w-4" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {children}
      </Transition>
    </Menu>
  );
}

Dropdown.Items = Menu.Items;
Dropdown.Item = Menu.Item;
