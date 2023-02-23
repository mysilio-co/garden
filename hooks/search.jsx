import {
  getSourceUrl,
  getStringNoLocale,
  getThing,
  getUrl,
} from '@inrupt/solid-client'
import { FOAF, OWL } from '@inrupt/vocab-common-rdf'
import { getItemAll, MY } from 'garden-kit'
import { useMemo } from 'react'
import useSWR from 'swr'
import {
  defaultOptions,
  FullTextFuseKeys,
  fuseEntriesFromGardenItems,
} from '../model/search'
import {
  getContactAll,
  useCommunityContacts,
  useCommunityGarden,
  usernameFromContact,
} from './community'
import Fuse from 'fuse.js'
import { useAuthentication } from 'swrlit'

export function useCommunityContactsSearchResults(search) {
  const { contacts } = useCommunityContacts()
  const contactsSettings =
    contacts && getThing(contacts, getSourceUrl(contacts))
  const fuseIndexUrl =
    contactsSettings && getUrl(contactsSettings, MY.Garden.hasFuseIndex)
  const entries =
    contacts &&
    getContactAll(contacts).map((contact) => {
      return {
        name: getStringNoLocale(contact, FOAF.name),
        webId: getStringNoLocale(contact, OWL.sameAs),
        usename: usernameFromContact(contact),
        href: webId,
      }
    })

  return useSearchResults(
    search,
    entries,
    defaultOptions(['name', 'username']),
    fuseIndexUrl
  )
}

export function useCommunityGardenSearchResults(search) {
  const { garden } = useCommunityGarden()
  return useGardenSearchResults(search, garden)
}

export function useGardenSearchResults(search, garden) {
  const gardenUrl = getSourceUrl(garden)
  const entries =
    garden && fuseEntriesFromGardenItems(getItemAll(garden), gardenUrl)
  const options = defaultOptions(FullTextFuseKeys)
  const gardenSettings = garden && getThing(garden, gardenUrl)
  console.log(gardenSettings)
  const fuseIndexUrl =
    gardenSettings && getUrl(gardenSettings, MY.Garden.hasFuseIndex)

  return useSearchResults(search, entries, options, fuseIndexUrl)
}

export function useSearchResults(search, entries, options, fuseIndexFile) {
  const { fetch } = useAuthentication()
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data } = useSWR(fuseIndexFile, fetcher)
  const fuseIndex = data && Fuse.parseIndex(data)

  const fuse = useMemo(() => {
    console.log(`Fuse index at ${fuseIndexFile}:`)
    console.log(data)
    console.log(fuseIndex)
    console.log(entries)
    console.log(options)
    if (!entries || entries.length === 0) {
      return undefined
    } else if (fuseIndex) {
      return new Fuse(entries, options, fuseIndex)
    } else {
      return new Fuse(entries, options)
    }
  }, [entries, options, fuseIndex])

  const results = useMemo(() => {
    if (fuse) {
      return fuse.search(search)
    } else {
      return []
    }
  }, [fuse, search])

  return results
}
