import {
  Thing,
  SolidDataset,
  Iri,
} from '@inrupt/solid-client';

export type Garden = SolidDataset;
export type GardenIndex = Iri;
export type GardenFilter = {
  // right now, we only support search based filtering,
  // but leave room for additional filter criteria later.
  search: string
};

export type GardenEntry = Thing;
export type Concept = GardenEntry;
export type Collection = GardenEntry;
export type Note = Concept;
export type NoteBody = SolidDataset;
export type Image = Concept;
export type File = Concept;
export type Bookmark = Concept;

export type UUID = string; // 'urn:uuid:...'