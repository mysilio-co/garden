import { createContext, useContext, useMemo } from 'react'
import { HomeSpaceSlug } from 'garden-kit/spaces'
import { useSpace } from 'garden-kit/hooks'

const NoteContext = createContext({})

export function NoteProvider({ webId, spaceSlug, gardenUrl, name, ...rest }) {
  const value = useMemo(() => ({ webId, spaceSlug, gardenUrl, name}), [webId, spaceSlug, gardenUrl, name])
  return (
    <NoteContext.Provider value={value} {...rest} />
  )
}

export const useNoteContext = () => useContext(NoteContext)

export default NoteContext;
