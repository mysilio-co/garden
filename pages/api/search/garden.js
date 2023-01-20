import { getSolidDataset, getThing } from '@inrupt/solid-client';
import Fuse from 'fuse.js';
import {
  getDescription,
  getItemAll,
  getNote,
  getNoteValue,
  getTitle,
  noteThingToSlateObject,
  thingsToArray,
} from 'garden-kit';

export const GardenUrl = 'https://mysilio.me/ian/spaces/home/public.ttl';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const garden = await getSolidDataset(GardenUrl);
    let fullTextFuseEntries = [];
    let fuseEntries = [];

    for (const item of getItemAll(garden)) {
      const title = getTitle(item);
      const description = item && getDescription(item);

      const noteBodyResourceUrl = item && getNote(item);
      const noteResource = await getSolidDataset(noteBodyResourceUrl);
      const noteBody = getThing(noteResource, noteBodyResourceUrl);
      const valueThing = getThing(
        noteResource,
        noteBody && getNoteValue(noteBody)
      );

      const value =
        valueThing &&
        noteResource &&
        thingsToArray(valueThing, noteResource, noteThingToSlateObject);

      const valueStr = JSON.stringify(value);
      fullTextFuseEntries = [
        ...fullTextFuseEntries,
        {
          title,
          description,
          valueStr,
        },
      ];
      fuseEntries = [
        ...fuseEntries,
        {
          title,
          description,
        },
      ];
    }

    const options = {
      includeScore: true,
      ignoreLocation: true,
      threshold: 0.3,
      keys: ['title', 'description', 'valueStr'],
    };
    console.log('=====================');
    console.log(fullTextFuseEntries);
    const index = Fuse.createIndex(options.keys, fullTextFuseEntries);
    console.log(index);
    console.log('=====================');
    const fuse = new Fuse(fuseEntries, options, index);

    return res.json(fuse.search('Robert Pirsig'));
  } else {
    return res.status(405).json({ message: 'Only supports GET' });
  }
}
