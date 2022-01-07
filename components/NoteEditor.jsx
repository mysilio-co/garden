import { useEffect } from 'react';
import { asUrl, isThingLocal } from '@inrupt/solid-client'

import Editor from "./Plate/Editor";
import { getAndParseNoteBody } from '../model/note'

export default function NoteEditor({ myNote, note, onNoteBodyChange, conceptNames, editorId, ...props }) {
  const noteUri = note && asUrl(note)
  const noteValue = getAndParseNoteBody(note)
  return (
    <Editor readOnly={myNote === false} editorId={editorId || noteUri} initialValue={noteValue} onChange={onNoteBodyChange} conceptNames={conceptNames} {...props} />
  )
}