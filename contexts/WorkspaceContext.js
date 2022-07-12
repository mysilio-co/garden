import { createContext, useContext, useMemo } from 'react'

const WorkspaceContext = createContext({slug: 'default', workspace: null})


export function WorkspaceProvider({webId, slug, ...rest}){
  const value = useMemo(() => ({webId, slug}), [webId, slug])
  return (
      <WorkspaceContext.Provider value={value} {...rest}/>
  )
}

export const useWorkspaceContext = () => useContext(WorkspaceContext)

export default WorkspaceContext;
