import { createContext, useContext, useMemo } from 'react'
import { HomeSpaceSlug } from 'garden-kit/spaces'
import { useSpace } from 'garden-kit/hooks'

const SpaceContext = createContext({ slug: HomeSpaceSlug, space: null })

export function SpaceProvider({ webId, slug = HomeSpaceSlug, ...rest }) {
  const value = useMemo(() => ({ webId, slug }), [webId, slug])
  return (
    <SpaceContext.Provider value={value} {...rest} />
  )
}

export const useSpaceContext = () => useContext(SpaceContext)

export default SpaceContext;
