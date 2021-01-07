import { useState, useCallback } from 'react'
import { useAuthentication, useLoggedIn, useMyProfile, useProfile, useWebId, useEnsured } from 'swrlit'
import {
  setStringNoLocale, getStringNoLocale, getUrl, setUrl, createSolid, getThingAll, asUrl,
  getDatetime
} from '@inrupt/solid-client'
import { FOAF, AS, RDF, RDFS, DCTERMS } from '@inrupt/vocab-common-rdf'
import { WS } from '@inrupt/vocab-solid-common'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { useConceptIndex } from '../hooks/concepts'
import { useStorageContainer, useFacebabyContainerUri } from '../hooks/uris'
import { conceptNameFromUri } from '../model/concept'

import Nav from '../components/nav'


function LoginUI(){
  const [handle, setHandle] = useState("")
  const [badHandle, setBadHandle] = useState(false)
  const { loginHandle, logout } = useAuthentication()
  async function logIn(){
    setBadHandle(false)
    try {
      await loginHandle(handle);
    } catch (e) {
      console.log("error:", e)
      setBadHandle(true)
    }
  }
  function onChange(e){
    setHandle(e.target.value)
    setBadHandle(false)
  }
  function onKeyPress(e){
    if (e.key === "Enter"){
      logIn()
    }
  }
  return (
    <div className="flex flex-col">
      <input type="text" className="pl-2 w-2/3 m-auto font-logo text-2xl rounded text-center text-black"
             placeholder="what's your handle?"
             value={handle} onChange={onChange} onKeyPress={onKeyPress}/>
      {badHandle && (
        <p className="text-xs text-red-500 m-auto mt-1">
          hm, I don't recognize that handle
        </p>
      )}
      <button className="text-white mt-6 text-3xl font-logo" onClick={logIn}>log in</button>
    </div>
  )
}

function NewNoteForm(){
  const router = useRouter()
  const [noteName, setNoteName] = useState("")
  const onCreate = useCallback(function onCreate(){
    router.push(`/notes/${encodeURIComponent(noteName)}`)
  })
  return (
    <div className="flex flex-row m-auto justify-center">
      <input value={noteName} onChange={e => setNoteName(e.target.value)} className="input-text mr-3 bg-gray-900" type="text" placeholder="New Note Name" />
      <button className="btn text-white" onClick={onCreate}>
        Create Note
      </button>
    </div>
  )
}

function Note({concept}){
  const uri = asUrl(concept)
  const nameInUri = conceptNameFromUri(uri)
  const name = decodeURIComponent(nameInUri)

  return (
    <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
      <Link href={`/notes/${nameInUri}`}>
        <a>
          <div className="w-full flex flex-col items-center justify-between p-6 space-x-6">
            <h3 className="text-gray-900 text-xl font-medium truncate text-center">
              {name}
            </h3>
          </div>
        </a>
      </Link>
    </li>
  )
}



function Notes(){
  const {index: conceptIndex, save: saveConceptIndex} = useConceptIndex()
  const concepts = conceptIndex && getThingAll(conceptIndex).sort(
    (a, b) => (getDatetime(b, DCTERMS.modified) - getDatetime(a, DCTERMS.modified))
  )
  return (
    <ul className="grid grid-cols-3 gap-6 sm:grid-cols-6 lg:grid-cols-9">
      {concepts && concepts.map(concept => <Note key={asUrl(concept)} concept={concept}/>)}
    </ul>
  )
}

export default function IndexPage() {
  const loggedIn = useLoggedIn()
  const { profile, save: saveProfile } = useMyProfile()
  const name = profile && getStringNoLocale(profile, FOAF.name)
  const [newName, setNewName] = useState("")
  async function onSave(){
    return await saveProfile(setStringNoLocale(profile, FOAF.name, newName))
  }

  const webId = useWebId()
  const appContainerUri = useFacebabyContainerUri(webId)
  return (
    <div className="bg-black text-white h-screen">
      <Nav />
      { (loggedIn === true) ? (
        <div>
          {name && (
            <h5 className="text-4xl text-center font-logo">you are {name}</h5>
          )}
          <div className="flex flex-row m-auto justify-center">
            <input value={newName} onChange={e => setNewName(e.target.value)} className="input-text bg-gray-900 mr-3" type="text" placeholder="New Name" />
            <button className="btn" onClick={onSave}>
              Set Name
            </button>
          </div>

          <NewNoteForm />
          <Notes />
        </div>
      ) : (
        (loggedIn === false) ? (
          <>
            <div className="py-20">
              <h1 className="text-6xl text-center bold font-logo text-white">
                FACE
              </h1>
              <h1 className="text-6xl text-center bold font-logo text-white">
                BABY
              </h1>
            </div>
            <LoginUI/>
          </>
        ) : (
          <div>
            loading....
          </div>
        )
      ) }
    </div>
  )
}
