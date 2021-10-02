import { useState } from 'react'

import { Close as CloseIcon } from "./icons"
import ConnectionsTabs from './ConnectionsTabs'
import { getTags, getLinks, tagUrlToTagName, conceptUrlToConceptName } from '../model/concept'
import Label from './Label'

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

function LinksSection({concept, conceptPrefix}){
  const links = getLinks(concept)
  return (
    <div className="p-6">
      {
        links && (links.map(link => (
          <Label>{conceptUrlToConceptName(link, conceptPrefix)}</Label>
        )))
      }
    </div>
  )
}

function ConnectionsSection({ subSection, concept, tagPrefix, conceptPrefix }) {
  switch (subSection) {
    case 'links':
      return (
        <LinksSection concept={concept} conceptPrefix={conceptPrefix}>
          Link
        </LinksSection>
      )
    case 'tags':
      return (
        <TagsSection concept={concept} tagPrefix={tagPrefix}>
          Tags
        </TagsSection>
      )
  }
}

export default function ConnectionsPanel({ onClose, concept, tagPrefix, conceptPrefix }) {
  const [activeTab, setActiveTab] = useState('links')
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between p-6">
        <h3 className="font-bold text-gray-500 leading-7 text-2xl">Connections</h3>
        <CloseIcon className="w-6 h-6 text-gray-700" onClick={onClose} />
      </div>
      <ConnectionsTabs active={activeTab} onChange={setActiveTab} />
      <ConnectionsSection subSection={activeTab} concept={concept} tagPrefix={tagPrefix} conceptPrefix={conceptPrefix} />
    </div>
  )
}