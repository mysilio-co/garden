import { asUrl } from '@inrupt/solid-client/thing/thing';
import { getSourceUrl } from '@inrupt/solid-client/resource/resource';
import { useWebId } from 'swrlit';
import { Loader } from './elements';
import ItemCard from './cards/ItemCard';
import { getItemAll } from 'garden-kit/garden';
import { getUrl } from '@inrupt/solid-client';
import { RDFS } from '@inrupt/vocab-common-rdf';
import { getTitle } from 'garden-kit';

export default function Cards({
  spaceSlug,
  webId,
  garden,
  isCommunityGarden = false,
}) {
  const myWebId = useWebId();
  const items = garden && getItemAll(garden);
  const hasItems = items && items.length > 0;
  return (
    <>
      {garden ? (
        hasItems ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {items &&
              items.map((item) => {
                console.log(
                  `name: ${getTitle(item)} Garden: ${getUrl(
                    item,
                    RDFS.seeAlso
                  )}`
                );
                return (
                  <ItemCard
                    key={asUrl(item)}
                    gardenUrl={
                      isCommunityGarden
                        ? getUrl(item, RDFS.seeAlso)
                        : garden && getSourceUrl(garden)
                    }
                    item={item}
                    webId={webId}
                    workspaceSlug={spaceSlug}
                  />
                );
              })}
          </ul>
        ) : (
          <div>
            <h2 className="text-2xl mb-2">
              {myWebId === webId
                ? 'You have nothing in your garden yet. Add something using the New button in the header above.'
                : `This garden is empty.`}
            </h2>
          </div>
        )
      ) : (
        <Loader />
      )}
    </>
  );
}
