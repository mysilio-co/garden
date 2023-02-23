import { Fragment, useState, useCallback } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { getSourceUrl } from '@inrupt/solid-client/resource/resource'
import { asUrl } from '@inrupt/solid-client/thing/thing'
import { getSpace, gardenMetadataInSpacePrefs } from 'garden-kit/spaces'
import { useSpaces } from 'garden-kit/hooks'
import { getTitle } from 'garden-kit/utils'
import {
  useLoggedIn,
  useAuthentication,
  useWebId,
} from 'swrlit/contexts/authentication'
import { classNames } from '../utils/html'

export default function GardenPicker({
  gardens = [],
  currentGarden,
  onChange,
}) {
  return (
    <Listbox value={asUrl(currentGarden)} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            {/* no label for now */}
          </Listbox.Label>
          <div className="relative">
            <Listbox.Button className="relative w-full border border-white text-white font-medium rounded-md shadow-sm pl-3 pr-10 py-1 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-white focus:border-white text-xs">
              <span className="block truncate">{getTitle(currentGarden)}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {gardens &&
                  gardens.map((garden) => (
                    <Listbox.Option
                      key={asUrl(garden)}
                      className={({ active }) =>
                        classNames(
                          active ? 'text-white bg-my-purple' : 'text-gray-900',
                          'cursor-default select-none relative py-2 pl-3 pr-9'
                        )
                      }
                      value={asUrl(garden)}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate'
                            )}
                          >
                            {getTitle(garden)}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
