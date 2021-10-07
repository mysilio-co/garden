import { useEffect } from 'react';
import { asUrl, isThingLocal } from '@inrupt/solid-client'
import {
  usePlateActions,
} from "@udecode/plate";

import Editor from "./Plate/Editor";
import { getAndParseNoteBody } from '../model/note'

export default function NoteEditor({ note, onNoteBodyChange, conceptNames, editorId, ...props }) {
  const noteUri = note && asUrl(note)
  const noteValue = getAndParseNoteBody(note)
  return (
    <Editor editorId={editorId || noteUri} initialValue={noteValue} onChange={onNoteBodyChange} conceptNames={conceptNames} {...props} />
  )
}