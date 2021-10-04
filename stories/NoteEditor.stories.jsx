import React, { useMemo } from 'react';
import NoteEditor from '../components/NoteEditor';

import { createOrUpdateSlateJSON } from '../model/note'

export default {
  component: NoteEditor,
  title: 'Components/NoteEditor',
  argTypes: { onNoteBodyChange: { action: 'clicked' } },
}

const NoteEditorStory = ({ slateJSON, ...args }) => {
  const note = useMemo(() => createOrUpdateSlateJSON(slateJSON), [slateJSON])
  return (
    <NoteEditor note={note} {...args} />
  )
}

/* !!!

Important note! Changing slateJSON in the storybook control SHOULD NOT update the UI:
the slate body is passed into the editor as "initial value" which does not update
the UI when changed.

!!! */

export const EmptyNoteEditor = NoteEditorStory.bind({})
EmptyNoteEditor.args = {
  slateJSON: [{ children: [{ text: '' }] }]
}

export const SimpleNoteEditor = NoteEditorStory.bind({})
SimpleNoteEditor.args = {
  slateJSON: [{ children: [{ text: 'cheeseburgers in paradise' }] }]
}

export const NoNoteNoteEditor = () => (
  <NoteEditor
    concept={concept}
    tagPrefix={tagPrefix} conceptPrefix={conceptPrefix} />
)