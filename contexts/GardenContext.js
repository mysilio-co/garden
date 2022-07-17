import { createContext, useContext, useMemo } from 'react'
import { HomeSpaceSlug } from 'garden-kit/hooks'

const GardenContext = createContext({ spaceSlug: HomeSpaceSlug, url: null })

export function GardenProvider({ spaceSlug = HomeSpaceSlug, url = null, ...rest }) {
  const value = useMemo(() => (
    { spaceSlug, url }
  ),
    [spaceSlug, url])
  return (
    <GardenContext.Provider value={value} {...rest} />
  )
}

export const useGardenContext = () => useContext(GardenContext)

export default GardenContext;
