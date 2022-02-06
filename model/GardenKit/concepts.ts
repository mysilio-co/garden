import { Concept, Image, File, Bookmark, Note } from './types';

export function isImage(concept: Concept): boolean {
  return false;
}

export function isFile(concept: Concept): boolean {
  return false;
}

export function isBookmark(concept: Concept): boolean {
  return false;
}

export function isNote(concept: Concept): boolean {
  return false;
}

export function asImage(concept: Concept): Image | undefined {
  if (isImage(concept)) {
    return concept;
  } else {
    return undefined;
  }
}

export function asFile(concept: Concept): File | undefined {
  if (isFile(concept)) {
    return concept;
  } else {
    return undefined;
  }
}

export function asBookmark(concept: Concept): Bookmark | undefined {
  if (isBookmark(concept)) {
    return concept;
  } else {
    return undefined;
  }
}

export function asNote(concept: Concept): Note | undefined {
  if (isNote(concept)) {
    return concept;
  } else {
    return undefined;
  }
}