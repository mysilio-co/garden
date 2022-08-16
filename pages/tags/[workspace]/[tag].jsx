import { useRouter } from 'next/router'
import { useWebId } from 'swrlit/contexts/authentication'
import { asUrl } from '@inrupt/solid-client/thing/thing'
import { getSourceUrl } from '@inrupt/solid-client/resource/resource'
import { MY } from 'garden-kit/vocab'
import dataFactory from "@rdfjs/data-model";

import { useItemIndex } from '../../../hooks/items'
import LeftNavLayout from '../../../components/LeftNavLayout'
import NoteCard from "../../../components/cards/NoteCard"

export default function TagPage() {
  const router = useRouter()
  const { query: { tag, workspace: spaceSlug } } = router
  const webId = useWebId()
  const { index, dataset } = useItemIndex(webId, spaceSlug)
   const taggedQuads = dataset && Array.from(dataset.match(null, MY.Garden.tagged, dataFactory.literal(tag)))
  const itemUrns = taggedQuads && taggedQuads.map(q => q.subject.value)
  const itemsAndGardens = itemUrns && itemUrns.map(u => [index.uri[u].item, index.uri[u].garden])

  return (
    <LeftNavLayout pageTitle={`Notes Tagged With "${tag}"`}>
      <div className="p-6">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">

          {itemsAndGardens && itemsAndGardens.map(([item, garden]) => (
            <NoteCard key={asUrl(item)}
              gardenUrl={getSourceUrl(garden)}
              item={item}
              webId={webId}
              workspaceSlug={spaceSlug} />
          ))}
        </ul>
      </div>
    </LeftNavLayout>
  );
}
