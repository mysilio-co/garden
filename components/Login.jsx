import { useState } from 'react'
import { useAuthentication } from 'swrlit/contexts/authentication'
import Link from 'next/link';

import { urlFromHost} from '../utils/uris';
import { Logo } from './logo'
import { Loader } from './elements'
import { ArrowCircleRight } from './icons'
import IDPPicker from './IDPPicker';

export default function Login({ }) {
  const [loggingIn, setLoggingIn] = useState(false)
  const [host, setHost] = useState("")
  const { login } = useAuthentication()
  async function logIn() {
    console.log(`logging in using ${host}`);
    setLoggingIn(true);
    try {
      await login({
        oidcIssuer: urlFromHost(host),
        redirectUrl: window.location.href,
        clientName: 'Mysilio Garden',
      });
    } catch (e) {
      setLoggingIn(false);
    }
  }
  return (
    <div className="flex flex-row items-stretch relative h-screen w-screen overflow-hidden">
      <div className="grow relative text-left bg-gradient-to-br from-my-green via-ocean to-my-purple p-14 text-white text-sm h-full w-1/2">
        <div className="text-xl md:text-2xl mt-36">Welcome to</div>
        <div className="text-6xl md:text-8xl font-black -mt-2 md:-mt-6 font-wordmark">
          mysilio
        </div>
        <div className="my-2">
          Which identity provider would you like to use to log in?
        </div>
        <div className="flex md:w-96">
          <IDPPicker
            setHost={setHost}
            className="flex-grow pr-3 text-gray-900"
          />
          {loggingIn ? (
            <Loader className="flex flex-row justify-center" />
          ) : (
            <button
              type="submit"
              className="flex flex-row items-center btn-sm p-3 md:btn-md btn-filled btn-square bg-white text-my-green h-10"
              onClick={() => logIn()}
            >
              Next <ArrowCircleRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row text-xs my-4">
          By logging in you agree to our
          <Link href="/tos">
            <a className="ml-1 text-my-yellow">terms of service</a>
          </Link>
        </div>
        <Logo className="absolute top-0 left-0 -ml-44 -mt-16 transform scale-105 opacity-5 w-4/5 pointer-events-none" />
      </div>
      <div className="relative grow h-full lg:block hidden w-1/2 overflow-hidden bg-forest-landscape bg-center bg-cover">
        <div className="h-full w-full bg-gradient-to-b from-my-green via-ocean to-my-purple opacity-100 mix-blend-color"></div>
      </div>
    </div>
  );
}