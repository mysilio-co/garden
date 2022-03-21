import { Fragment, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import {
  HomeIcon,
  MenuIcon,
  UserGroupIcon,
  XIcon,
} from '@heroicons/react/outline'

import { asUrl } from '@inrupt/solid-client'
import { FOAF } from '@inrupt/vocab-common-rdf';
import { getUrl, getStringNoLocale } from '@inrupt/solid-client'

import { useMyProfile, useLoggedIn, useAuthentication } from 'swrlit'

import ProfileDrawer from './ProfileDrawer'
import Avatar from './Avatar';
import logoAndName from '../public/img/logo-and-text.png'
import { Logo } from './logo'

import { profilePath } from '../utils/uris'

const dashboardNavItem = { name: 'Dashboard', href: '/', icon: HomeIcon }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function AvatarSection({ avatarImgSrc, name, profileDrawerOpen, setProfileDrawerOpen }) {
  return (
    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
      <button type="button"
        className="flex-shrink-0 w-full group block"
        onClick={() => setProfileDrawerOpen(!profileDrawerOpen)}>
        <div className="flex items-center">
          <div>
            <Avatar
              src={avatarImgSrc}
              className="w-12 h-12 cursor-pointer object-cover"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-300 group-hover:text-gray-100 ">{name}</p>
            <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">
              {profileDrawerOpen ? 'Hide' : 'View'} profile
            </p>
          </div>
        </div>
      </button>
    </div>
  )
}

function DefaultHeader({ openSidebar }) {
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between bg-header-gradient px-4 py-1.5">
        <Logo className="mt-2 -ml-2 h-12 w-12" />
        <div>
          <button
            type="button"
            className="-mr-3 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-200 hover:text-white"
            onClick={openSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

const defaultHeaderProps = {}

export default function LeftNavLayout({ pageName, children, HeaderComponent = DefaultHeader, headerProps = defaultHeaderProps }) {
  const { profile, save: saveProfile } = useMyProfile()
  const avatarImgSrc = profile && getUrl(profile, FOAF.img);
  const name = profile && getStringNoLocale(profile, FOAF.name)

  const loggedIn = useLoggedIn()
  const { logout } = useAuthentication()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const navigation = [
    dashboardNavItem,
    { name: `My Profile`, href: profile ? profilePath(asUrl(profile)) : "/", icon: UserGroupIcon, current: false }
  ].map((i) => {
    i.current = (pageName == i.name)
    return i
  })
  return (
    <>
      <div className="h-full flex">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-500 border-r border-gray-200 focus:outline-none">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 px-4 relative w-52">
                    <Image
                      layout="responsive"
                      src={logoAndName}
                      alt="Mysilio"
                    />
                  </div>
                  <nav aria-label="Sidebar" className="mt-5">
                    <div className="px-2 space-y-1">
                      {navigation.map((item) => (
                        <Link href={item.href}>
                          <a
                            key={item.name}
                            className={classNames(
                              item.current
                                ? 'bg-gray-400 text-gray-200'
                                : 'text-gray-200 hover:bg-gray-50 hover:text-gray-900',
                              'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                'mr-4 h-6 w-6'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
                <AvatarSection name={name} avatarImgSrc={avatarImgSrc} profileDrawerOpen={profileDrawerOpen} setProfileDrawerOpen={setProfileDrawerOpen} />
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
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
                    {navigation.map((item) => (
                      <Link href={item.href}>
                        <a
                          key={item.name}
                          className={classNames(
                            item.current
                              ? 'bg-gray-400 text-gray-200'
                              : 'text-gray-200 hover:bg-gray-50 hover:text-gray-900',
                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                              'mr-3 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
              <AvatarSection name={name} avatarImgSrc={avatarImgSrc} profileDrawerOpen={profileDrawerOpen} setProfileDrawerOpen={setProfileDrawerOpen} />
            </div>
          </div>
        </div>
        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
          <HeaderComponent openSidebar={useCallback(() => setSidebarOpen(true))} {...headerProps} />

          <div className="flex-1 relative z-0 flex overflow-hidden">
            <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
              {children}
            </main>
            <Transition show={profileDrawerOpen} as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <aside className="hidden relative xl:order-first xl:flex xl:flex-col flex-shrink-0 p-4 w-96 border-r border-gray-200 bg-gray-500 overflow-y-auto">
                <ProfileDrawer profile={profile} saveProfile={saveProfile} loggedIn={loggedIn} logout={logout} setIsOpen={setProfileDrawerOpen} />
              </aside>
            </Transition>
          </div>
        </div>
      </div>
    </>
  )
}
