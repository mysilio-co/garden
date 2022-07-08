import { useMyProfile } from 'swrlit/hooks/things'
import { getUrlAll } from '@inrupt/solid-client/thing/get'
import { sioc as SIOC } from 'rdf-namespaces'

export function useFollows(){
  const { profile } = useMyProfile()
  return profile && getUrlAll(profile, SIOC.follows)
}
