import { useState } from 'react'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { Input } from '../components/inputs'
import { Logo } from '../components/logo'
import { sendMagicLink } from '../utils/fetch'

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('username is required'),
  email: Yup.string()
    .email('invalid email')
    .required('email is required'),
});

export default function LoginPage() {
  const [success, setSuccess] = useState()
  const onSubmit = async ({ username, email }) => {
    const result = await sendMagicLink(username, email)
    if (result && (result.status == 200)) {
      setSuccess(true)
    } else {
      setSuccess(false)
    }
    console.log(result)
  }
  return (
    <div className="flex flex-row items-stretch relative h-screen w-screen overflow-hidden">
      <div className="grow relative text-left bg-gradient-to-br from-my-green via-ocean to-my-purple p-14 text-white text-sm h-full w-1/2">

        <h3 className="text-5xl mt-12 mb-6">
          Get a magic login link.
        </h3>
        <p className="text-xl mb-12">
          Please enter your the username and email you used to register.
        </p>
        {(success !== undefined) && (
          <div className="text-4xl text-purple-300 mb-12">
            {
              success ? (
                <>
                  <h3 className="mb-6">
                    Success! A magic link has been sent to your email.
                  </h3>
                  <h3>Please click the link to log in.</h3>
                </>
              ) : (
                <h3>Hm, something has gone wrong. Did you use the right username and email?</h3>
              )
            }
          </div>
        )}

        <Formik
          initialValues={{
            username: '',
            email: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (

            <Form>
              <div className="flex flex-col">
                <Input name="username"
                  className="mb-2"
                  placeholder="what's your username" />

                <Input
                  className=""
                  name="email"
                  placeholder="what's your email"
                  type="email"
                />

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
        <div className="h-full w-full bg-gradient-to-b from-my-green via-ocean to-my-purple opacity-100 mix-blend-color"></div>
      </div>
    </div>
  )
}
