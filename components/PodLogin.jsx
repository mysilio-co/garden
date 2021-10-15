import { Logo } from './logo';
import { Formik } from 'formik'
import { ArrowRight as ArrowRightIcon } from './icons'
import { Input } from './inputs';
import Image from 'next/image';
import forestImage from "../public/forest-landscape.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function PodLogin({ avatarImgSrc }) {
  return (
    <div className="flex flex-row items-stretch relative h-screen overflow-hidden">
      <div className="relative z-10 bg-gradient-to-br from-my-green via-ocean to-passionflower p-14 text-white text-sm h-full md:w-1/2 w-full">
        <div className="relative w-4/5">
          <Logo className='z-0 absolute -ml-44 -mt-16 transform scale-105 opacity-5' />
        </div>
        <div className="text-2xl mt-36">
         Please login to your 
        </div> 
        <div class="text-8xl font-black">solid pod</div>
      </div> 
      <div className="flex flex-row z-10 w-1/2">
        <div className="flex flex-col mt-36 w-full ">
          <Formik>
            <>
            Username
            <Input type="text" name="username"
              className="flex flex-row" />
            </>
          </Formik>
          <Formik>
            <div className="mt-2">
            Password
            <Input type="text" name="password"
              className="flex flex-row" />
            </div>
          </Formik>
          <button
            type="button"
            className={`btn bg-white text-center text-my-green flex mt-8`}
          >
            Login
          </button>
          <button
            type="button"
            className={`btn bg-white items-center text-my-green flex mt-8`}
          >
            Login with certificate (WebId-TLS)
          </button>
          <button
            type="button"
            className={`btn bg-white text-center text-my-green flex mt-8`}
          >
            Create an account
          </button>
          <button
            type="button"
            className={`btn bg-white text-center text-my-green flex mt-8`}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="flex flex-row z-0 items-stretch bg-gradient-to-br from-my-green via-ocean to-passionflower absolute w-full h-full left-48 lg:left-64 xl:left-96 md:block hidden"> 
        <Image className="z-0 object-cover mix-blend-hard-light opacity-60" src={forestImage} alt="forest" layout="fill" /> 
      </div>
    </div>
  )
}