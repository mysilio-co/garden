import { createContext, useContext, useMemo } from 'react'
import { HomeSpaceSlug } from 'garden-kit/spaces'

const GardenContext = createContext({ spaceSlug: HomeSpaceSlug, url: null })

export function GardenProvider({ url = null, ...rest }) {
  const value = useMemo(() => (
    { url }
  ),
    [url])
  return (
    <GardenContext.Provider value={value} {...rest} />
  )
}

export const useGardenContext = () => useContext(GardenContext)

export default GardenContext;
