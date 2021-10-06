import Editor from "./Plate/Editor";

import { getAndParseNoteBody } from '../model/note'

export default function NoteEditor({editorId, note, onNoteBodyChange, conceptNames, ...props}){
  const noteValue = getAndParseNoteBody(note)
  return (
    <Editor editorId={editorId} initialValue={noteValue} onChange={onNoteBodyChange} conceptNames={conceptNames} {...props}/>
  )
}