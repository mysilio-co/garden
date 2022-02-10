import {
  Thing,
  SolidDataset,
  Iri,
  IriString,
} from '@inrupt/solid-client';

export type Urn = Iri;
export type UUID = Urn;

export type UrnString = IriString;
export type UUIDString = UrnString;

export type Garden = SolidDataset;
export type GardenIndex = IriString;
export type GardenConfig = Thing;

export type OGTags = {
  ogTitle: string;
  ogDescription: string;
  ogImage: {
    url: string;
  };
  ogUrl: string;
};

export type GardenItem = Thing;
export type Concept = GardenItem;
export type Collection = GardenItem;
// prefixed with Garden to avoid type conflicts with default TS types for File, etc
export type GardenNote = Concept;
export type GardenImage = Concept;
export type GardenFile = Concept;
export type GardenBookmark = Concept;
export type NoteBody = SolidDataset;