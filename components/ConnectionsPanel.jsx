import { useState, forwardRef, Suspense } from 'react'
import { asUrl } from '@inrupt/solid-client/thing/thing'
import Link from 'next/link'
import {
  HomeIcon,
  MenuIcon,
  UserGroupIcon,
  XIcon,
} from '@heroicons/react/outline'

import {
  getTags, getLinks, tagUrlToTagName,
  conceptIdFromUri,
  conceptUrisThatReference,
} from '../model/concept'
import Label from './Label'
import { notePath, urlSafeIdToConceptName } from "../utils/uris";
import { Close as CloseIcon } from "./icons"
import ConnectionsTabs from './ConnectionsTabs'


function TagsSection({ concept, tagPrefix, workspaceSlug }) {
  const tags = getTags(concept)
  return (
    <div className="p-6">
      {tags && tags.map(tag => {
        const tagName = tagUrlToTagName(tag, tagPrefix)
        return (
          <div>
            <Link href={`/tags/${workspaceSlug}/${tagName}`}>
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

function LinkToConcept({ uri, webId, workspaceSlug, ...props }) {
  const id = conceptIdFromUri(uri);
  const name = urlSafeIdToConceptName(id);
  const url = notePath(webId, workspaceSlug, name)
  return (
    <Link href={url}>
      <a>
        <Label>{name}</Label>
      </a>
    </Link>
  );
}

function linksToConceptInIndex(concept, conceptIndex) {
  const conceptUri = asUrl(concept)
  return conceptUrisThatReference(conceptIndex, conceptUri);
}

function LinksSection({ concept, conceptName, webId, workspaceSlug, conceptIndex }) {
  const links = getLinks(concept)
  const linksTo = conceptIndex ? linksToConceptInIndex(concept, conceptIndex) : []

  return (
    <div className="p-6">
      <h4 className="text-lg mb-2">links from {conceptName}</h4>
      <div className="flex flex-row flex-wrap gap-3">
        {
          links && (links.map(link => (
            <LinkToConcept key={link} uri={link} webId={webId} workspaceSlug={workspaceSlug} />
          )))
        }
      </div>
      <h4 className="text-lg mt-4 mb-2">links to {conceptName}</h4>
      <div className="flex flex-row flex-wrap gap-3">
        {
          linksTo && (linksTo.map(link => (
            <LinkToConcept key={link} uri={link} webId={webId} workspaceSlug={workspaceSlug} />
          )))
        }
      </div>
    </div>
  )
}

function ConnectionsSection({ subSection, concept, conceptName, tagPrefix, conceptPrefix, webId, workspaceSlug, conceptIndex }) {
  switch (subSection) {
    case 'links':
      return (
        <Suspense fallback={<div>loading..</div>}>
          <LinksSection concept={concept} conceptName={conceptName} conceptPrefix={conceptPrefix} webId={webId} workspaceSlug={workspaceSlug} conceptIndex={conceptIndex}>
            Link
          </LinksSection>
        </Suspense>
      )
    case 'tags':
      return (
        <TagsSection concept={concept} conceptName={conceptName} tagPrefix={tagPrefix} workspaceSlug={workspaceSlug}>
          Tags
        </TagsSection>
      )
  }
}

const ConnectionsPanel = forwardRef(({ onClose, concept, conceptName, tagPrefix, conceptPrefix, className, webId, workspaceSlug, conceptIndex }, ref) => {
  const [activeTab, setActiveTab] = useState('links')
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
      <ConnectionsSection subSection={activeTab} concept={concept} conceptName={conceptName} tagPrefix={tagPrefix} conceptPrefix={conceptPrefix}
        webId={webId} workspaceSlug={workspaceSlug} conceptIndex={conceptIndex} />
    </div>
  )
})

export default ConnectionsPanel