import { getUrl } from '@inrupt/solid-client/thing/get'
import { useThing } from 'swrlit/hooks/things'
export default function Foo() {
  const {data} = useThing("https://travis.mysilio.me/public/public.ttl")
  const bar = getUrl(null)
  return <div>foo {bar} {data}</div>
}