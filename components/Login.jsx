import { Logo } from './logo';
import { Formik } from 'formik'
import { ArrowRight as ArrowRightIcon } from './icons'
import { Input } from './inputs';
import Image from 'next/image';
import forestImage from "../public/forest-landscape.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Login({ avatarImgSrc }) {
  return (
    <div className="flex flex-row items-stretch relative h-screen overflow-hidden">
      <div className="relative z-10 bg-gradient-to-br from-my-green via-ocean to-passionflower p-14 text-white text-sm h-full md:w-1/2 w-full">
        <div className="relative w-4/5">
          <Logo className='z-0 absolute -ml-44 -mt-16 transform scale-105 opacity-5' />
        </div>
        <div className="text-2xl mt-36">
        Welcome to
        </div> 
        <div class="text-8xl font-black -mt-6">mysilio</div>
        <div className="my-2">
          Enter your username to get started
        </div>
        <div className="flex">
          <Formik>
            <Input type="text" name="username" 
              className="flex-grow" />
          </Formik>
          <button
            type="button"
            className={`btn bg-white text-my-green flex`}
          >
            Next <ArrowRightIcon className="ipt-header-search-icon text-my-green" />
          </button>
        </div>
        <div className="flex text-xs my-4">
        By logging in you agree to our 
        <a className="text-my-yellow" href="">terms of service</a>
        </div>
      </div> 
      <div className="flex flex-row  items-stretch bg-gradient-to-br from-my-green via-ocean to-passionflower absolute w-full h-full left-48 lg:left-64 xl:left-96 md:block hidden"> 
        <Image className="z-0 object-cover mix-blend-hard-light opacity-60" src={forestImage} alt="forest" layout="fill" /> 
      </div>
    </div>
  )
}