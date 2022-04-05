import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

import {
  HomeIcon,
  LoginIcon,
  BookOpenIcon,
} from '@heroicons/react/outline'

import logoAndName from '../public/img/logo-and-text.png'

import DefaultHeader from './DefaultHeader'


const defaultHeaderProps = {}

function DummyLeftNavLayout({ pageName, pageTitle, children, HeaderComponent = DefaultHeader, headerProps = defaultHeaderProps }) {
  return (
    <>
      <div className="h-screen flex relative">
        {/* Static sidebar for desktop */}
        <div className="min-h-full hidden lg:flex lg:flex-shrink-0 z-10">
          <div className="flex flex-col w-64">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-500 border-r border-gray-200">
              <div className="flex-1 flex flex-col pb-4 overflow-y-auto">
                <div className="flex-shrink-0 px-4 relative w-52">
                  <Link href="/">
                    <Image
                      layout="responsive"
                      src={logoAndName}
                      alt="Mysilio"
                    />
                  </Link>
                </div>
                <nav className="mt-5 flex-1" aria-label="Sidebar">
                  <div className="px-2 space-y-1">
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col min-w-0 flex-1 overflow-y-scroll">
          <HeaderComponent pageTitle={pageTitle} {...headerProps} />
          <div className="h-full flex-1 relative z-0 flex">
            <main className="h-full flex-1 relative z-0 focus:outline-none xl:order-last">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

const DynamicLeftNavLayout = dynamic(
  () => import('./DynamicLeftNavLayout'),
  {
    loading: (p) => {
      return (<DummyLeftNavLayout />)
    }
  }
)
export default function LeftNavLayout(props) {
  return (
    <DynamicLeftNavLayout {...props} />
  )
}