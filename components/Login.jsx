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
      <div className="relative z-10 bg-my-green p-14 text-white text-sm h-full md:w-1/2 w-full">
        <div className="relative">
          <Logo className='w-4/5 z-0 absolute -ml-16 mt-20 transform scale-150 opacity-20' />
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
        By logging in you agree to our terms of service
        </div>
      </div> 
      <div className="flex flex-row items-stretch absolute w-full h-full left-48 lg:left-64 xl:left-96 md:block hidden"> 
        <Image className="z-0 object-cover" src={forestImage} alt="forest" layout="fill" /> 
      </div>
    </div>
  )
}