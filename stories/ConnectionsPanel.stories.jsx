import React from 'react'
import ConnectionsPanel from '../components/ConnectionsPanel'
import { createConceptFor } from '../model/concept'

export default {
  component: ConnectionsPanel,
  title: 'Components/ConnectionsPanel',
}

const tagPrefix = 'https://example.com/tags/'
const conceptPrefix = 'https://example.com/concepts/'

const concept = createConceptFor(
  'ham',
  conceptPrefix,
  ['bacon', 'pig', 'cheese'],
  tagPrefix,
  ['lunch', 'breakfast', 'sandwiches']
)

export const StandardConnectionsPanel = () => (
  <ConnectionsPanel
    concept={concept}
    tagPrefix={tagPrefix}
    conceptPrefix={conceptPrefix}
  />
)
