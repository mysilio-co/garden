import { useState, useEffect } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Combobox } from '@headlessui/react'
import { IsPreviewEnv } from '../model/flags'
import { classNames } from '../utils/html'

const IDPList = IsPreviewEnv
  ? [
      { name: 'Production', host: 'https://mysilio.me' },
      { name: 'Staging', host: 'https://staging.mysilio.me' },
      { name: 'Legacy NSS', host: 'https://v0.mysilio.me' },
    ]
  : [
      { name: 'Mysilio', host: 'https://mysilio.me' },
      { name: 'Inrupt', host: 'https://inrupt.net' },
      { name: 'Solid Community', host: 'https://solidcommunity.net' },
      { name: 'Solid Web', host: 'https://solidweb.org' },
    ]

export default function IDPPicker({ setHost, className }) {
  const [query, setQuery] = useState('')
  const [selectedIDP, setSelectedIDP] = useState()
  const setIDP = (idp) => {
    console.log(`setting IDP: ${idp && idp.name}`)
    setSelectedIDP(idp)
    setHost(idp.host)
  }
  useEffect(() => {
    setIDP(IDPList[0])
  }, [])

  const filtered =
    query === ''
      ? IDPList
      : IDPList.filter((idp) => {
          return (
            idp.name.toLowerCase().includes(query.toLowerCase()) ||
            idp.host.toLowerCase().includes(query.toLowerCase())
          )
        }).concat([
          {
            name: query,
            host: query,
          },
        ])

  return (
    <Combobox
      as="div"
      value={selectedIDP}
      onChange={setIDP}
      className={className}
    >
      <div className="relative">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(idp) => idp && idp.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filtered.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filtered.map((idp) => (
              <Combobox.Option
                key={idp.name}
                value={idp}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex">
                      <span
                        className={classNames(
                          'truncate',
                          selected && 'font-semibold'
                        )}
                      >
                        {idp.name}
                      </span>
                      {idp.name !== idp.host && (
                        <span
                          className={classNames(
                            'ml-2 truncate text-gray-500',
                            active ? 'text-indigo-200' : 'text-gray-500'
                          )}
                        >
                          {idp.host}
                        </span>
                      )}
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
