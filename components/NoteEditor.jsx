import Editor from "./Plate/Editor";

import { getStringNoLocale } from '@inrupt/solid-client'
import { US } from '../vocab'
import { noteBodyToSlateJSON } from "../utils/slate";

function getAndParseNoteBody(note) {
  const bodyJSON = note && getStringNoLocale(note, US.noteBody);
  const slateJSON = note && getStringNoLocale(note, US.slateJSON);
  if (slateJSON) {
    return JSON.parse(slateJSON);
  } else if (bodyJSON) {
    return noteBodyToSlateJSON(JSON.parse(bodyJSON))
  } else {
    return null
  }
}


function useNoteBody(note) {
  return getAndParseNoteBody(note)
}
export default function NoteEditor({editorId, note, onNoteBodyChange, conceptNames}){
  const noteValue = useNoteBody(note)
  return (
    <Editor editorId={editorId} initialValue={noteValue} onChange={onNoteBodyChange} conceptNames={conceptNames} />
  )
}