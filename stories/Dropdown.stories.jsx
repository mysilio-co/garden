import React from 'react'
import Dropdown from '../components/Dropdown'

export default {
  component: Dropdown,
  title: 'Components/Dropdown',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const StandardDropdown = () => (
  <Dropdown className="ml-40" label="New">
    <Dropdown.Items className="origin-top-left absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
      <div className="py-1">
        <Dropdown.Item>
          {({ active }) => (
            <a
              href="#"
              className={classNames(
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm'
              )}
            >
              Account settings
            </a>
          )}
        </Dropdown.Item>
        <Dropdown.Item>
          {({ active }) => (
            <a
              href="#"
              className={classNames(
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm'
              )}
            >
              Support
            </a>
          )}
        </Dropdown.Item>
        <Dropdown.Item>
          {({ active }) => (
            <a
              href="#"
              className={classNames(
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm'
              )}
            >
              License
            </a>
          )}
        </Dropdown.Item>
      </div>
      <div className="py-1">
        <form method="POST" action="#">
          <Dropdown.Item>
            {({ active }) => (
              <button
                type="submit"
                className={classNames(
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block w-full text-left px-4 py-2 text-sm'
                )}
              >
                Sign out
              </button>
            )}
          </Dropdown.Item>
        </form>
      </div>
    </Dropdown.Items>
  </Dropdown>
)
StandardDropdown.parameters = {
  backgrounds: { default: 'dark' },
}
