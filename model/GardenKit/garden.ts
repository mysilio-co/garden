import { Garden, GardenIndex, GardenItem, UUID} from './types';

function addItem(garden: Garden, item: GardenItem): Garden {
  // create new item
  // will throw if item exists
  // returns updated Garden 

}

function setItem(garden: Garden, item: GardenItem): Garden {
  // overwrites existing item
  // will create if item doesn't exist
  // returns updated Garden
}

function deleteItem(garden: Garden, item: GardenItem): Garden {

}

function findItemByUUID(garden: Garden, uuid: UUID): GardenItem {

}

function findItemByName(garden: Garden, name: string): GardenItem {

}

function loadGarden(index: GardenIndex): Garden {

}

function saveGarden(index: GardenIndex, garden: Garden): Garden {

}

function createNewGardenShard(
  mainIndex: GardenIndex,
  shardIndex: GardenIndex
) : Garden {
  // setup an empty Garden subindex at the given subindex iri
  // linked to the given main index iri
}

function createNewGarden(index: GardenIndex): Garden {
  // setup an empty Garden index at the given iri
}
