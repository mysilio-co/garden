import {
  getTitle,
  useGarden,
  useSpaces,
  gardenMetadataInSpacePrefs,
  getSpace,
  HomeSpaceSlug,
} from 'garden-kit'
import { useState, Fragment } from 'react'
import { useWebId } from 'swrlit'
import {
  useCommunityContactsSearchResults,
  useCommunityGardenSearchResults,
  useGardenSearchResults,
} from '../hooks/search'
import { Search as SearchIcon } from './icons'
import { Combobox, Transition } from '@headlessui/react'
import { asUrl, getSourceUrl, getThing } from '@inrupt/solid-client'
import { classNames } from '../utils/html'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function SearchResults({ title, results }) {
  return (
    <>
      {results && results.length > 0 && (
        <div className="uppercase text-gray-300 text-xs mt-2.5 px-4">
          {title}
        </div>
      )}
      {results &&
        results.map((result) => (
          <Link
            href={result.item.href}
            key={result.item.href}
            passHref
            legacyBehavior
          >
            <Combobox.Option value={result} as={Fragment}>
              {({ active }) => (
                <a
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'menu-item'
                  )}
                >
                  {result.item.title}
                </a>
              )}
            </Combobox.Option>
          </Link>
        ))}
    </>
  )
}

export function CommunityGardenSearchResults({ search }) {
  const results = useCommunityGardenSearchResults(search)
  return <SearchResults title="Community Garden" results={results} />
}

export function CommunityContactsSearchResults({ search }) {
  const results = useCommunityContactsSearchResults(search)
  return <SearchResults title="People" results={results} />
}

export function GardenSearchResults({ search, gardenUrl }) {
  const { garden } = useGarden(gardenUrl)
  const gardenSettings = garden && getThing(garden, getSourceUrl(garden))
  const results = useGardenSearchResults(search, garden)
  if (gardenSettings)
    return <SearchResults title={getTitle(gardenSettings)} results={results} />
  else return <></>
}

export default function Search({}) {
  const [search, setSearch] = useState('')

  const webId = useWebId()
  const { spaces } = useSpaces(webId)
  const home = spaces && getSpace(spaces, HomeSpaceSlug)
  const gardens = spaces && gardenMetadataInSpacePrefs(home, spaces)
  const router = useRouter()
  const [selectedResult, setSelectedResult] = useState(undefined)

  const selectSearchResult = (result) => {
    setSelectedResult(result)
    router.push(result.item.href)
  }

  return (
    <div className="flex flex-row self-center">
      <div className="relative overflow-y-visible">
        <Combobox value={selectedResult} onChange={selectSearchResult}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="ipt-header-search-icon" />
            </div>
            <Combobox.Input
              type="search"
              name="search"
              placeholder="Search"
              className="pl-12 ipt ipt-header-search"
              displayValue={(result) => (result ? result.item.title : search)}
              onChange={(event) => setSearch(event.target.value)}
            />
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
            <Combobox.Options className="origin-top-left absolute right-0 mt-2 w-64 rounded-lg overflow-hidden shadow-menu text-xs bg-white focus:outline-none z-40">
              {gardens &&
                gardens.map((garden) => {
                  return (
                    <GardenSearchResults
                      key={asUrl(garden)}
                      search={search}
                      gardenUrl={asUrl(garden)}
                    />
                  )
                })}
              <CommunityGardenSearchResults search={search} />
              <CommunityContactsSearchResults search={search} />
            </Combobox.Options>
          </Transition>
        </Combobox>
      </div>
    </div>
  )
}
