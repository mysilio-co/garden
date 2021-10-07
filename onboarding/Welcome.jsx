import { useState, useCallback } from 'react'
import { useResource, useAuthentication, useLoggedIn, useMyProfile, useProfile, useWebId, useEnsured } from 'swrlit'
import { Logo } from '../components/logo'

export default function Welcome() {
  const [username, setUsername] = useState("")
  const [badHandle, setBadHandle] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const { loginHandle, logout } = useAuthentication()
  const handle = username.includes(".") ? username : `${username}.myunderstory.com`
  async function logIn() {
    setBadHandle(false)
    setLoggingIn(true)
    try {
      await loginHandle(handle);
    } catch (e) {
      console.log("error:", e)
      setBadHandle(true)
      setLoggingIn(false)
    }
  }
  function onChange(e) {
    setUsername(e.target.value)
    setBadHandle(false)
  }
  function onKeyPress(e) {
    if (e.key === "Enter") {
      logIn()
    }
  }
  return (
    <div className="relative h-screen bg-gradient-to-br from-my-green via-ocean to-my-purple pt-12 px-12 text-left">
      <Logo className="absolute top-0 -left-32 h-screen opacity-10 pointer-events-none" />
      <div className="mb-12 text-white" >
        <h2 className="text-3xl sm:text-2xl md:text-6xl lg:text-7xl font-bold">
          Welcome to
        </h2>
        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold">
          Mysilio
        </h1>
      </div>
      <input type="text" className="pl-2 w-2/3 m-auto text-2xl rounded text-black"
        placeholder="what is your username?"
        value={username} onChange={onChange} onKeyPress={onKeyPress} />
      {badHandle && (
        <p className="text-red-500 m-auto mt-2">
          hm, I don't recognize that username
        </p>
      )}
      {loggingIn ? (
        <Loader className="flex flex-row justify-center" />
      ) : (
        <button className="btn-md btn-square btn-emphasis mt-6 p-3 text-3xl flex-auto block hover:shadow-md" onClick={logIn}>
          log in
        </button>
      )}
      <p className="mt-3 text-gray-300">By logging in you agree to be bound by our <a href="/tos">Terms of Service</a></p>
    </div>
  )
}
