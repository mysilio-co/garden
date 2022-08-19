import { FOAF, DCTERMS } from "@inrupt/vocab-common-rdf";
import { getStringNoLocale, getDatetime, getUrl } from "@inrupt/solid-client/thing/get";
import { asUrl } from "@inrupt/solid-client/thing/thing";
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthentication } from 'swrlit'
import { getSolidDataset, saveSolidDatasetAt } from '@inrupt/solid-client/resource/solidDataset'
import { getSourceUrl } from '@inrupt/solid-client/resource/resource'
import { setThing, removeThing, getThing } from '@inrupt/solid-client/thing/thing'
import { getSolidDatasetWithAcl } from '@inrupt/solid-client/acl/acl'

import { mutate } from 'swr'
import { getNote, getFile } from 'garden-kit/items'
import { setPublicAccessBasedOnGarden } from 'garden-kit/acl'
import { getDepiction } from 'garden-kit/utils'

import {
  MenuIcon,
} from '@heroicons/react/outline'

import { getTitle } from 'garden-kit/utils'
import { useSpaces } from 'garden-kit/hooks'
import { gardenMetadataInSpacePrefs, getSpace } from 'garden-kit/spaces'


import Avatar from './Avatar';
import { getRelativeTime } from '../utils/time';
import { profilePath, itemPath } from '../utils/uris';
import { Trashcan } from './icons'
import GardenPicker from "./GardenPicker";

async function moveItem(item, fromGardenUrl, toGardenUrl, { fetch }) {
  const [fromGarden, toGarden] = await Promise.all([
    getSolidDataset(fromGardenUrl, { fetch }),
    getSolidDatasetWithAcl(toGardenUrl, { fetch })
  ])

  const newFromGarden = removeThing(fromGarden, item)
  const newToGarden = setThing(toGarden, item)

  await mutate(toGardenUrl, saveSolidDatasetAt(toGardenUrl, newToGarden, { fetch }))
  await mutate(fromGardenUrl, saveSolidDatasetAt(fromGardenUrl, newFromGarden, { fetch }))

  await setPublicAccessBasedOnGarden([
    getNote(item),
    getDepiction(item),
    getFile(item)
  ].filter(x => x), toGarden, { fetch })
}

function NoteHeaderGardenPicker({ webId, spaceSlug, currentGardenUrl, item }) {
  const router = useRouter()
  const { spaces } = useSpaces(webId)
  const space = getSpace(spaces, spaceSlug)
  const gardens = space && gardenMetadataInSpacePrefs(space, spaces)
  const currentGarden = gardens && gardens.find(g => (asUrl(g) === currentGardenUrl))
  const { fetch } = useAuthentication()
  async function onChange(newGardenUrl) {
    await moveItem(item, currentGardenUrl, newGardenUrl, { fetch })
    router.replace(itemPath(webId, spaceSlug, newGardenUrl, getTitle(item)))
  }
  return (<GardenPicker gardens={gardens} currentGarden={currentGarden} onChange={onChange} />)
}

export default function NoteHeader({
  item, deleteItem, authorProfile,
  myNote, saving, openSidebar, spaceSlug, gardenUrl
}) {
  const router = useRouter()
  const authorName = authorProfile && getStringNoLocale(authorProfile, FOAF.name);
  const avatarImgSrc = authorProfile && getUrl(authorProfile, FOAF.img)

  const noteCreatedAt = item && getDatetime(item, DCTERMS.created);
  const noteLastEdit = item && getDatetime(item, DCTERMS.modified);

  const authorWebId = authorProfile && asUrl(authorProfile)
  const bg = myNote ? "bg-header-gradient" : "bg-my-green"

  const itemName = item && getTitle(item)

  const authorProfilePath = authorWebId && profilePath(authorWebId)
  async function deleteAndRedirect() {
    const confirmed = confirm(`Are you sure you want to delete ${itemName}?`)
    if (confirmed) {
      await deleteItem()
      router.push("/")
    }
  }
  return (
    <div className="flex flex-col">
      <nav className={`${bg} b-2xl flex flex-col gap-4 md:flex-row justify-between min-h-32 p-4`}>
        <div className="flex flex-col items-left">
          <div className="flex justify-between">
            <div className="text-white text-4xl font-black">
              {itemName}
            </div>
            <button
              type="button"
              className="inline-flex md:hidden flex-shrink-0 h-12 w-12 items-center justify-center rounded-md text-gray-200 hover:text-white"
              onClick={openSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex mt-3 h-3 text-sm text-white items-center">
            {authorProfilePath && (
              <div className="flex flex-col sm:flex-row sm:gap-2 items-center">
                <Link href={authorProfilePath}>
                  <a>
                    <Avatar src={avatarImgSrc} border={false} className="h-6 w-6" />
                  </a>
                </Link>
                <Link href={authorProfilePath}>
                  <a>
                    <div className="font-bold text-my-yellow">{authorName}</div>
                  </a>
                </Link>
              </div>
            )}
            <div className="ml-2 opacity-50 flex flex-col sm:flex-row sm:gap-2 items-center">
              <b>Created</b><span>{noteCreatedAt && getRelativeTime(noteCreatedAt)}</span>
            </div>
            <div className="ml-2 opacity-50 flex flex-col sm:flex-row sm:gap-2 items-center">
              {saving ? (
                <b>Saving...</b>
              ) : (
                <>
                  <b>Last Edit</b><span> {noteLastEdit && getRelativeTime(noteLastEdit)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row h-10 gap-4 items-center">
            {myNote && (
              <>
                <button onClick={deleteAndRedirect} className="">
                  <Trashcan className="h-6 w-6 text-white" />
                </button>
              </>
            )}
            {item && myNote && (<NoteHeaderGardenPicker webId={authorWebId} spaceSlug={spaceSlug} currentGardenUrl={gardenUrl} item={item} />)}
            {/*
          <button type="button" className="ml-7 inline-flex items-center p-2.5 bg-white/10 border border-white shadow-sm text-sm font-medium rounded-3xl text-white">
            <span>
              Share
            </span>
            <SendIcon className="w-4 h-4" />
          </button>
          */}
            <button
              type="button"
              className="hidden md:inline-flex lg:hidden -mr-3 h-12 w-12 items-center justify-center rounded-md text-gray-200 hover:text-white"
              onClick={openSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}