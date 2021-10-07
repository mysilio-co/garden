import { useState, forwardRef } from 'react'
import { asUrl } from '@inrupt/solid-client'
import { useWebId } from 'swrlit'
import { namedNode } from "@rdfjs/dataset";
import Link from 'next/link'

import { US } from "../vocab";
import {
   getTags, getLinks, tagUrlToTagName,
  conceptIdFromUri,
  conceptUrisThatReference,
 } from '../model/concept'
import Label from './Label'
import { notePath, urlSafeIdToConceptName } from "../utils/uris";
import { useWorkspaceContext } from "../contexts/WorkspaceContext";
import {
  useConceptIndex,
  useCombinedConceptIndex,
  useConcept,
  useConceptNames
} from "../hooks/concepts";

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

function LinksTo({ name }) {
  const webId = useWebId();
  const { slug: workspaceSlug } = useWorkspaceContext();
  const { concept } = useConcept(webId, workspaceSlug, name);
  const conceptUris = concept && getUrlAll(concept, US.refersTo);
  return (
    <ul>
      {conceptUris &&
        conceptUris.map((uri) => (
          <li key={uri}>
            <LinkToConcept uri={uri} />
          </li>
        ))}
    </ul>
  );
}

function LinksFrom({ conceptUri }) {
  const webId = useWebId();
  const { slug: workspaceSlug } = useWorkspaceContext();
  const { index } = useCombinedConceptIndex(webId, workspaceSlug);
  const linkingConcepts = index.match(
    null,
    namedNode(US.refersTo),
    namedNode(conceptUri)
  );
  return (
    <ul>
      {conceptUrisThatReference(index, conceptUri).map((uri) => (
        <li key={uri}>
          <LinkToConcept uri={uri} />
        </li>
      ))}
    </ul>
  );
}

function useLinksTo(concept) {
  const conceptUri = asUrl(concept)
  const webId = useWebId();
  const { slug: workspaceSlug } = useWorkspaceContext();
  // TODO: useCombinedConceptIndex is broken after some changes in the solid library - fix!
  const { index } = useCombinedConceptIndex(webId, workspaceSlug);
  const linkingConcepts = index.match(
    null,
    namedNode(US.refersTo),
    namedNode(conceptUri)
  );
  return linkingConcepts;
}

function LinksSection({ concept, conceptPrefix }) {
  const webId = useWebId();
  const { slug: workspaceSlug } = useWorkspaceContext();
  const links = getLinks(concept)

  // //TODO
  // const linksTo = useLinksTo(concept)
  //console.log("LINKS TO", linksTo)


  return (
    <div className="p-6">
      {
        links && (links.map(link => (
          <LinkToConcept uri={link} webId={webId} workspaceSlug={workspaceSlug} />
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

const ConnectionsPanel = forwardRef(({ onClose, concept, tagPrefix, conceptPrefix, className }, ref) => {
  const [activeTab, setActiveTab] = useState('links')
  return (
    <div className={`flex flex-col ${className}`} ref={ref}>
      <div className="flex flex-row justify-between p-6 bg-gray-100">
        <h3 className="font-bold text-gray-500 leading-7 text-2xl">Connections</h3>
        <CloseIcon className="w-6 h-6 text-gray-700 cursor-pointer" onClick={onClose} />
      </div>
      <ConnectionsTabs active={activeTab} onChange={setActiveTab} />
      <ConnectionsSection subSection={activeTab} concept={concept} tagPrefix={tagPrefix} conceptPrefix={conceptPrefix} />
    </div>
  )
})

export default ConnectionsPanel