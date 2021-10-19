import { Logo } from './logo';
import { Formik } from 'formik'
import { ArrowRight as ArrowRightIcon } from './icons'
import { Input } from './inputs';
import { ArrowCircleRight } from './icons'
import Image from 'next/image';
import forestImage from '../public/forest-landscape.png';

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
        <div className="text-2xl md:mt-36">
         Please login to your 
        </div> 
        <div class="md:text-8xl text-4xl font-black">solid pod</div>
      </div> 
      <div className="flex flex-row z-10 w-full mt-36 md:mt-0 md:w-1/2 absolute md:relative">
        <div className="flex flex-col md:mt-36 px-20 flex-grow">
          <Formik>
            <div className="text-white">
              Username
              <Input type="text" name="username"
                className="flex flex-row mt-2" />
            </div>
          </Formik>
          <Formik>
            <div className="text-white mt-2">
            Password
            <Input type="text" name="password"
              className="flex flex-row mt-2" />
            </div>
          </Formik>
          <div className="flex flex-col md:flex-row">
            <button
              type="button"
              className={`flex btn-md btn-filled btn-square bg-white text-my-green mt-8 h-10`}
            >
              Login <ArrowCircleRight className="w-10 h-10 -m-1 ml-2" />
            </button>
            <div className="text-right text-sm text-my-yellow flex-grow mt-3 md:mt-8">
              Forgot password?
            </div>
          </div>
          <button
            type="button"
            className={`text-white text-sm border-t border-b border-opacity-100 border-white rounded-r-sm bg-opacity-0 items-center mt-5 md:mt-8 p-3 md:p-6`}
          >
            Login with certificate (WebId-TLS)
          </button>
          <button
            type="button"
            className={`p-2 bg-white border border-opacity-100 border-white bg-opacity-20 text-center text-white mt-5 md:mt-8 rounded-full`}
          >
            Create an account
          </button>
          <button
            type="button"
            className={`btn bg-opacity-0 text-center text-white mt-6`}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="flex flex-row z-0 items-stretch bg-gradient-to-br from-my-green via-ocean to-passionflower absolute w-full h-full left-48 lg:left-64 xl:left-96 md:block hidden"> 
        <Image className="z-0 object-cover mix-blend-soft-light opacity-90 filter blur-md" src={forestImage} alt="forest" layout="fill" /> 
      </div>
    </div>
  )
}