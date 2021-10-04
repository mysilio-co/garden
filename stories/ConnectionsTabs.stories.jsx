import React, { useState } from 'react';
import ConnectionsTabs from '../components/ConnectionsTabs';

export default {
  component: ConnectionsTabs,
  title: 'Components/ConnectionsTabs '
}

export const LinksConnectionsTabs = () => (
  <ConnectionsTabs active="links" />
)

export const TagsConnectionsTabs = () => (
  <ConnectionsTabs active="tags" />
)

export const StatefulConnectionsTabs = () => {
  const [active, setActive] = useState("links")
  return (
    <div>
      <ConnectionsTabs active={active} onChange={setActive} />
    </div>
  )
}

