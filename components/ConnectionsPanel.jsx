import { useState, forwardRef, Suspense } from 'react'
import { asUrl } from '@inrupt/solid-client/thing/thing'
import { getSourceUrl } from '@inrupt/solid-client/resource/resource'
import Link from 'next/link'
import { XIcon } from '@heroicons/react/outline'
import dataFactory from "@rdfjs/data-model";

import {
  conceptUrisThatReference,
} from '../model/concept'
import { getTags, getReferences } from 'garden-kit/items'
import { getTitle } from 'garden-kit/utils'
import { useSpace } from 'garden-kit/hooks'
import { getNurseryFile } from 'garden-kit/spaces'
import { MY } from 'garden-kit/vocab'

import Label from './Label'
import { itemPath } from "../utils/uris";
import { useItemIndex } from "../hooks/items"
import ConnectionsTabs from './ConnectionsTabs'

function TagsSection({ item, spaceSlug }) {
  const tags = getTags(item)
  return (
    <div className="p-6">
      {tags && tags.map(tagName => {
        return (
          <div key={tagName}>
            <Link href={`/tags/${spaceSlug}/${tagName}`}>
              <a className="text-my-green">
                #{tagName}
              </a>
            </Link>
          </div>
        )
      }
      )}
    </div>
  )
}

function LinkToItem({ name, webId, gardenUrl, spaceSlug }) {
  const url = itemPath(webId, spaceSlug, gardenUrl, name)
  return (
    <Link href={url}>
      <a>
        <Label>{name}</Label>
      </a>
    </Link>
  )
}

function referencesItemInDataset(item, dataset) {
  const references = dataset.match(null, MY.Garden.references, dataFactory.literal(getTitle(item)))
  return Array.from(references).map(q => q.subject.value)

  //return conceptUrisThatReference(conceptIndex, conceptUri);
}

function gardenUrlForName(name, index, defaultGardenUrl) {
  const garden = index.name[name] && index.name[name].garden
  return garden ? getSourceUrl(garden) : defaultGardenUrl
}

function LinkReferencingItem({ uri, webId, spaceSlug, index }) {
  const i = index.uri[uri]
  if (i) {
    const name = getTitle(i.item)
    const gardenUrl = getSourceUrl(i.garden)
    return (
      <LinkToItem key={uri} name={name} webId={webId} spaceSlug={spaceSlug} gardenUrl={gardenUrl} />
    )
  } else {
    return <></>
  }
}

function LinksSection({ item, webId, spaceSlug }) {
  const { index, dataset } = useItemIndex(webId, spaceSlug)
  const { space } = useSpace(webId, spaceSlug)
  const defaultGardenUrl = getNurseryFile(space)
  const linkNames = getReferences(item)

  const referencedBy = dataset ? referencesItemInDataset(item, dataset) : []

  const itemName = getTitle(item)
  return (
    <div className="p-6">
      <h4 className="text-lg mb-2">links from {itemName}</h4>
      <div className="flex flex-row flex-wrap gap-3">
        {
          index && linkNames && (linkNames.map(name => (
            <LinkToItem key={name} name={name} webId={webId} spaceSlug={spaceSlug} gardenUrl={gardenUrlForName(name, index, defaultGardenUrl)} />
          )))
        }
      </div>
      <h4 className="text-lg mt-4 mb-2">links to {itemName}</h4>
      <div className="flex flex-row flex-wrap gap-3">
        {
          referencedBy && (referencedBy.map(uri => (
            <LinkReferencingItem uri={uri} index={index} webId={webId} spaceSlug={spaceSlug}/>
          )))
        }
      </div>
    </div>
  )
}

function ConnectionsSection({ subSection, webId, item, spaceSlug, itemIndex }) {
  switch (subSection) {
    case 'links':
      return (
        <Suspense fallback={<div>loading..</div>}>
          <LinksSection item={item} webId={webId} spaceSlug={spaceSlug} itemIndex={itemIndex}>
            Link
          </LinksSection>
        </Suspense>
      )
    case 'tags':
      return (
        <TagsSection item={item} spaceSlug={spaceSlug}>
          Tags
        </TagsSection>
      )
  }
}

const ConnectionsPanel = forwardRef(({ onClose, item, itemName, className, webId, spaceSlug, itemIndex }, ref) => {
  const [activeTab, setActiveTab] = useState('tags')
  return (
    <div className={`flex flex-col ${className}`} ref={ref}>
      <div className="flex flex-row gap-4 justify-between items-center p-4 bg-gray-100">
        <h3 className="font-bold text-gray-500 leading-7 text-2xl">Connections</h3>
        <button
          type="button"
          className="ml-1 flex items-center justify-center h-6 w-6 rounded-full focus:outline-none ring-1 ring-inset ring-gray-500 hover:ring-gray-400 text-gray-500 hover:text-gray-400"
          onClick={onClose}
        >
          <span className="sr-only">Close connections panel</span>
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <ConnectionsTabs active={activeTab} onChange={setActiveTab} />
      <ConnectionsSection subSection={activeTab} item={item} itemName={itemName}
        webId={webId} spaceSlug={spaceSlug} itemIndex={itemIndex} />
    </div>
  )
})

export default ConnectionsPanel