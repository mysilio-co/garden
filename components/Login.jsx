import { Logo } from './logo';
import Image from 'next/image';
import forestImage from "../public/forest-landscape.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Login({ avatarImgSrc }) {
  return (
    <div className="h-screen flex flex-row items-stretch">
      <div className="relative w-1/2 overflow-hidden bg-my-green p-14 text-white text-sm">
        <Logo className='w-96 z-0 absolute -ml-16 transform scale-150 opacity-20' />
        <div className="text-2xl">
        Welcome to <div class="text-8xl font-black">mysilio</div>
        </div> 
        Enter your username to get started
        <div className="flex flex-row">
        Next
        </div>
        <div className="text-xs">
        By logging in you agree to our <div className="">terms of service</div>
        </div>
      </div> 
      <div className="">
       <Image className="" src={forestImage} alt="forest" width="2000" height="1000" /> 
      </div> 
    </div>
  )
}