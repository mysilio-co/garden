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

export type Space = Thing;
export type SpaceIri = IriString;

export type Garden = SolidDataset;
export type GardenConfig = Thing;
export type GardenIri = IriString;
export type GardenContainer = IriString;

export type GardenItem = Thing;
export type Concept = GardenItem;
export type Collection = GardenItem;
// prefixed with Garden to avoid type conflicts with default TS types for File, etc
export type NoteConcept = Concept;
export type ImageConcept = Concept;
export type FileConcept = Concept;
export type BookmarkConcept = Concept;
export type PersonConcept = Concept;
export type NoteBody = SolidDataset;