import { getDatetime } from '@inrupt/solid-client';
import { getTitle, getDescription, getDepiction } from 'garden-kit/utils';
import { itemPath } from '../../utils/uris.js';
import Card from './Card.jsx';
import { DCTERMS } from '@inrupt/vocab-common-rdf';
import { getCreator } from 'garden-kit';

export default function ItemCard({ item, webId, workspaceSlug, gardenUrl }) {
  const title = getTitle(item);
  const url = itemPath(webId, workspaceSlug, gardenUrl, title);
  const lastEdit = item && getDatetime(item, DCTERMS.modified);
  const coverImageUrl = item && getDepiction(item);
  const description = item && getDescription(item);
  const creator = item && getCreator(item);

  return (
    <Card
      key={url}
      title={title}
      description={description}
      depiction={coverImageUrl}
      creator={creator}
      href={url}
      lastEdit={lastEdit}
    />
  );
}
