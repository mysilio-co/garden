import { asUrl } from "@inrupt/solid-client/thing/thing";
import { getSourceUrl } from '@inrupt/solid-client/resource/resource'
import { useWebId } from "swrlit";
import { Loader } from './elements'
import ItemCard from './cards/ItemCard'
import { getItemAll } from "garden-kit/garden";

export function CardsFromGarden({ garden, webId, filteredItems, spaceSlug }) {
  const items = filteredItems || (garden && getItemAll(garden));
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {items &&
        items.map((item) => {
          return (
            <ItemCard
              key={asUrl(item)}
              gardenUrl={garden && getSourceUrl(garden)}
              item={item}
              webId={webId}
              workspaceSlug={spaceSlug}
            />
          );
        })}
    </ul>
  );
}

export default function Cards({ spaceSlug, webId, garden }) {
  const myWebId = useWebId();
  const hasItems = garden && (getItemAll(garden).length > 0)
  return (
    <>
      {garden ? (
        hasItems ? (
          <CardsFromGarden
            webId={webId}
            garden={garden}
            spaceSlug={spaceSlug}
          />
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
