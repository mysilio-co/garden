import { useState, forwardRef, Suspense } from 'react'
import { asUrl } from '@inrupt/solid-client'
import Link from 'next/link'

import {
  getTags, getLinks, tagUrlToTagName,
  conceptIdFromUri,
  conceptUrisThatReference,
} from '../model/concept'
import Label from './Label'
import { notePath, urlSafeIdToConceptName } from "../utils/uris";
import { Close as CloseIcon } from "./icons"
import ConnectionsTabs from './ConnectionsTabs'

function TagsSection({ concept, tagPrefix }) {
  const tags = getTags(concept)
  return (
    <div className="p-6">
      {tags && tags.map(tag => (
        <div>{tagUrlToTagName(tag, tagPrefix)}</div>
      ))}
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
        <TagsSection concept={concept} conceptName={conceptName} tagPrefix={tagPrefix}>
          Tags
        </TagsSection>
      )
  }
}

const ConnectionsPanel = forwardRef(({ onClose, concept, conceptName, tagPrefix, conceptPrefix, className, webId, workspaceSlug, conceptIndex }, ref) => {
  const [activeTab, setActiveTab] = useState('links')
  return (
    <div className={`flex flex-col ${className}`} ref={ref}>
      <div className="flex flex-row justify-between p-6 bg-gray-100">
        <h3 className="font-bold text-gray-500 leading-7 text-2xl">Connections</h3>
        <CloseIcon className="w-6 h-6 text-gray-700 cursor-pointer" onClick={onClose} />
      </div>
      <ConnectionsTabs active={activeTab} onChange={setActiveTab} />
      <ConnectionsSection subSection={activeTab} concept={concept} conceptName={conceptName} tagPrefix={tagPrefix} conceptPrefix={conceptPrefix}
        webId={webId} workspaceSlug={workspaceSlug} conceptIndex={conceptIndex} />
    </div>
  )
})

export default ConnectionsPanel