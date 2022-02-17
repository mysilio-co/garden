import { useState } from 'react'
import { useAuthentication } from 'swrlit'
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { handleToIdp } from '../utils/uris'
import { DefaultPodDomain } from '../model/flags';
import { Logo } from './logo'
import { Loader } from './elements'
import { ArrowCircleRight } from './icons'
import { Input } from './inputs'

const HandleSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Too Short!')
    .required('username is required')
});

export default function Login({ }) {
  const [loggingIn, setLoggingIn] = useState(false)
  const { login } = useAuthentication()
  async function logIn({ username, ...rest }, { setErrors }) {
    const handle = username.includes(".") ? username : `${username}.${DefaultPodDomain}`
    setLoggingIn(true)
    try {
      await login({ oidcIssuer: handleToIdp(handle), redirectUrl: window.location.href, clientName: "Mysilio Garden" });
    } catch (e) {
      setLoggingIn(false)
      setErrors({
        username: "hm, I don't recognize that username"

      })
    }
  }
  return (
    <div className="flex flex-row items-stretch relative h-screen w-screen overflow-hidden">
      <div className="grow relative text-left bg-gradient-to-br from-my-green via-ocean to-my-purple p-14 text-white text-sm h-full w-1/2">
        <div className="text-xl md:text-2xl mt-36">
          Welcome to
        </div>
        <div className="text-6xl md:text-8xl font-black -mt-2 md:-mt-6 font-wordmark">
          mysilio
        </div>
        <div className="my-2">
          Enter your username to get started
        </div>
        <Formik
          initialValues={{ username: '' }}
          validationSchema={HandleSchema}
          onSubmit={logIn}>
          <Form className="flex md:w-96">
            <Input type="text" name="username" className="flex-grow pr-3 text-gray-900" />
            {loggingIn ? (
              <Loader className="flex flex-row justify-center" />
            ) : (
              <button
                type="submit"
                className="flex flex-row items-center btn-sm p-3 md:btn-md btn-filled btn-square bg-white text-my-green h-10"
              >
                Next <ArrowCircleRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </Form>
        </Formik>

        <div className="flex flex-col md:flex-row text-xs my-4">
          By logging in you agree to our
          <Link href="/tos">
            <a className="ml-1 text-my-yellow">terms of service</a>
          </Link>
        </div>
        <Logo className='absolute top-0 left-0 -ml-44 -mt-16 transform scale-105 opacity-5 w-4/5 pointer-events-none' />
      </div>
      <div className="relative grow h-full lg:block hidden w-1/2 overflow-hidden bg-forest-landscape bg-center bg-cover">
        <div className="h-full w-full bg-gradient-to-b from-my-green via-ocean to-my-purple opacity-100 mix-blend-color"></div>
      </div>
     </div>
  )
}