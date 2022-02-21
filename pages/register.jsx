import { useState } from 'react'
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link'

import { Input } from '../components/inputs'
import { Logo } from '../components/logo'
import { sendMagicLink } from '../utils/fetch'

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .matches(/^[a-z0-9]+$/, "Your username should only contain lowercase letters a-z and numbers 0-9 and without periods or spaces.")
    .required('username is required'),
  email: Yup.string()
    .email('invalid email')
    .required('email is required'),
  password: Yup.string()
});

export default function RegistrationPage() {
  const [success, setSuccess] = useState()
  const onSubmit = async ({ username, email, password }) => {
    const result = await sendMagicLink(username, email, password)
    if (result && (result.status == 200)) {
      setSuccess(true)
    } else {
      setSuccess(false)
    }
  }
  return (
    <div className="flex flex-row items-stretch relative h-screen w-screen overflow-hidden">
      <div className="grow relative text-left bg-gradient-to-br from-my-green via-ocean to-my-purple p-14 text-white text-sm h-full w-1/2">
        <p className="text-3xl mb-6"> Create Your Account </p>
        {(success !== undefined) && (
          <div className="text-2xl mb-12">
            {
              success ? (
                <>
                  <h3 className="mb-6">
                    Success! A magic link has been sent to your email.
                  </h3>
                  <h3>Please click the link in your email to log in.</h3>
                </>
              ) : (
                <h3>Hm, something has gone wrong. Most likely, a user with that username already exists.</h3>
              )
            }
          </div>
        )}

        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (

            <Form>
              <div className="flex flex-col">
                <Input
                  className="mb-2"
                  name="username"
                  type="text"
                  placeholder="pick a username" />

                <Input
                  className="mb-2"
                  name="email"
                  placeholder="what's your email"
                  type="email"
                />

                <Input
                  className="mb-2"
                  name="password"
                  placeholder="choose a password"
                  type="password"
                />

                <p className="text-sm mt-4">
                  By creating an account you agree to our
                  <Link href="/tos">
                    <a className="ml-1 text-my-yellow">terms of service</a>
                  </Link>
                </p>

                <button className="btn btn-lg btn-emphasis btn-square mt-12 text-4xl py-6" type="submit">
                  send me a magic login link
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <Logo className='absolute top-0 left-0 -ml-44 -mt-16 transform scale-105 opacity-5 w-4/5 pointer-events-none' />
      </div>
      <div className="relative grow h-full lg:block hidden w-1/2 overflow-hidden bg-forest-landscape bg-center bg-cover">
        <div className="h-full w-full bg-gradient-to-b from-my-green via-ocean to-my-purple opacity-100 mix-blend-color">
        </div>
        <div className="absolute top-0 left-0 right-0 m-8 p-4 rounded-lg shadow-md shadow-slate-900 text-slate-100 bg-slate-800 bg-opacity-70 mix-blend-normal text-center">
          <h3 className="text-3xl my-12">🌻🌿🌱 Welcome to Mysilio Garden! 🌱🌿🌻 </h3>
          <p className="text-xl mb-8">
            Mysilio Garden is currently in early alpha - we cannot make any guarantees about the stability of the service
            or the safety of your data. As a result, please treat this as a sandbox.
          </p>
          <p className="text-xl mb-8">
            After signing, we'll send you a "magic login link" that will allow you to log into the service once. If you are
            logged out, you'll be able to log back in using the login form on <a href="https://mysilio.garden">the home page</a> but
            you will need to go through the "forgot password" flow before you'll be able to fully log in.
          </p>
        </div>

      </div>
    </div>
  )
}
