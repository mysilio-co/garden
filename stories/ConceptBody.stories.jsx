import React, { useMemo } from 'react';
import ConceptBody from '../components/ConceptBody';
import { createConceptFor } from '../model/concept'
import { createOrUpdateSlateJSON } from '../model/note'

export default {
  component: ConceptBody,
  title: 'Components/ConceptBody',
  argTypes: { onNoteBodyChange: { action: 'clicked' } },
}

const tagPrefix = "https://example.com/tags/"
const conceptPrefix = "https://example.com/concepts/"

const concept = createConceptFor(
  "ham", conceptPrefix, ["bacon", "pig", "cheese"],
  tagPrefix, ["lunch", "breakfast", "sandwiches"]
)

const ConceptBodyStory = ({ slateJSON, ...args }) => {
  const note = useMemo(() => createOrUpdateSlateJSON(slateJSON), [slateJSON])
  return (
    <ConceptBody
      concept={concept} note={note}
      tagPrefix={tagPrefix} conceptPrefix={conceptPrefix} {...args} />
  )
}

/* !!!

Important note! Changing slateJSON in the storybook control SHOULD NOT update the UI:
the slate body is passed into the editor as "initial value" which does not update
the UI when changed.

!!! */

export const EmptyConceptBody = ConceptBodyStory.bind({})
EmptyConceptBody.args = {
  slateJSON: [{ children: [{ text: '' }] }],
  panelStartsOpen: false
}

export const SimpleConceptBody = ConceptBodyStory.bind({})
SimpleConceptBody.args = {
  slateJSON: [{ children: [{ text: 'this is a simple note' }] }],
  panelStartsOpen: false
}


export const SimpleConceptBodyPanelOpen = ConceptBodyStory.bind({})
SimpleConceptBodyPanelOpen.args = {
  slateJSON: [{ children: [{ text: 'this is a simple note with the panel open' }] }],
  panelStartsOpen: true
}

export const NoNoteConceptBody = () => (
  <ConceptBody
    concept={concept}
    tagPrefix={tagPrefix} conceptPrefix={conceptPrefix} />
)