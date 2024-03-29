import { Fragment, useMemo, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Dialog, Popover, Transition } from '@headlessui/react'
import {
  HomeIcon,
  LoginIcon,
  BookOpenIcon,
  UserGroupIcon,
  XIcon,
} from '@heroicons/react/outline'

import { asUrl } from '@inrupt/solid-client/thing/thing'
import { FOAF } from '@inrupt/vocab-common-rdf'
import { getUrl, getStringNoLocale } from '@inrupt/solid-client/thing/get'

import {
  useLoggedIn,
  useAuthentication,
  useWebId,
} from 'swrlit/contexts/authentication'
import { useMyProfile } from 'swrlit/hooks/things'

import ProfileDrawer from './ProfileDrawer'
import Avatar from './Avatar'
import DefaultHeader from './DefaultHeader'
import logoAndName from '../public/img/logo-and-text.png'

import { profilePath, gardenPath } from '../utils/uris'
import { SpaceProvider } from '../contexts/SpaceContext'
import { GardenProvider } from '../contexts/GardenContext'

import { useSpaces } from 'garden-kit/hooks'
import {
  HomeSpaceSlug,
  getSpaceAll,
  getSpaceSlug,
  gardenMetadataInSpacePrefs,
} from 'garden-kit/spaces'
import { getTitle } from 'garden-kit/utils'

const defaultLoggedInNavItems = [
  { name: 'Community Garden', href: '/', icon: HomeIcon },
]
const defaultLoggedOutNavItems = [
  { name: 'Community Garden', href: '/', icon: HomeIcon },
  { name: 'Log In', href: '/login', icon: LoginIcon },
  { name: 'Sign Up', href: '/signup', icon: BookOpenIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function EllipsesMenu({ loggedIn, logout, className = '' }) {
  return (
    <Popover className={`relative ${className}`}>
      <Popover.Button className="outline-none focus:outline-none">
        <div className="rounded-full border h-8 w-8 text-gray-200">
          <span className="align-top relative -top-1">...</span>
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute w-36 bottom-8 z-40 rounded-md overflow-hidden shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        {loggedIn && false && (
          <Link href="/settings">
            <a className="menu-item">settings</a>
          </Link>
        )}
        <Link href="/privacy">
          <a className="menu-item" role="menuitem">
            privacy
          </a>
        </Link>
        <Link href="/tos">
          <a className="menu-item" role="menuitem">
            terms of service
          </a>
        </Link>
        {loggedIn && (
          <button
            type="submit"
            className="menu-item"
            role="menuitem"
            onClick={logout}
          >
            log out
          </button>
        )}
      </Popover.Panel>
    </Popover>
  )
}

function AvatarSection({
  className = '',
  avatarImgSrc,
  name,
  profileDrawerOpen,
  setProfileDrawerOpen,
  loggedIn,
  logout,
}) {
  return (
    <div
      className={`flex-shrink-0 flex border-t bg-gray-500 border-gray-200 p-4 ${className}`}
    >
      {loggedIn && (
        <button
          type="button"
          className="flex-1 group block"
          onClick={() => setProfileDrawerOpen(!profileDrawerOpen)}
        >
          <div className="flex items-center">
            <div>
              <Avatar
                src={avatarImgSrc}
                className="w-12 h-12 cursor-pointer object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300 group-hover:text-gray-100 ">
                {name}
              </p>
              <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">
                {profileDrawerOpen ? 'Hide' : 'Edit'} profile settings
              </p>
            </div>
          </div>
        </button>
      )}
      <EllipsesMenu
        loggedIn={loggedIn}
        logout={logout}
        className="self-center"
      />
    </div>
  )
}

const defaultHeaderProps = {}

function navigationItems({
  router,
  loggedIn,
  pageName,
  profile,
  spaces,
  webId,
  selectedSpaceSlug,
  selectedGardenUrl,
}) {
  const allSpaces = spaces && getSpaceAll(spaces)
  const spaceItems = allSpaces
    ? allSpaces.map((space, i) => {
        const spaceSlug = getSpaceSlug(space)
        const gardens = gardenMetadataInSpacePrefs(space, spaces)
        return {
          name: getTitle(space) || `Space ${i}`,
          subItems:
            gardens &&
            gardens.map((garden) => {
              const gardenUrl = asUrl(garden)
              return {
                name: getTitle(garden),
                spaceSlug,
                gardenUrl,
                onClick: function () {
                  router.push(gardenPath(webId, spaceSlug, gardenUrl))
                },
              }
            }),
        }
      })
    : []
  const profileItems = profile
    ? [
        {
          name: `My Profile`,
          href: profile ? profilePath(asUrl(profile)) : '/',
          icon: UserGroupIcon,
        },
      ]
    : []
  const basicNavItems = loggedIn
    ? defaultLoggedInNavItems
    : defaultLoggedOutNavItems
  return [...basicNavItems, ...profileItems, ...spaceItems].map((i) => {
    if (
      selectedSpaceSlug &&
      selectedSpaceSlug === i.spaceSlug &&
      selectedGardenUrl &&
      selectedGardenUrl === i.gardenUrl
    ) {
      i.current = true
    } else {
      i.current = pageName == i.name
    }
    return i
  })
}

function navItemClasses(item, { hover = false, subItem = false } = {}) {
  return classNames(
    item.current
      ? 'bg-gray-400 text-gray-200'
      : `text-gray-200 ${hover ? 'hover:bg-gray-50 hover:text-gray-900' : ''}`,
    `group flex items-center ${
      subItem ? 'ml-4 px-2 text-sm' : 'px-2 py-2 text-base'
    } font-medium rounded-md`
  )
}

function navItemIconClasses(item, { hover = false, subItem = false } = {}) {
  return classNames(
    item.current
      ? 'text-gray-500'
      : `text-gray-400 ${hover ? 'group-hover:text-gray-500' : ''}`,
    'mr-4 h-6 w-6'
  )
}

function NavigationItem({ item, subItem = false }) {
  return (
    <>
      {item.href ? (
        <Link href={item.href} key={item.name}>
          <a className={navItemClasses(item, { hover: true, subItem })}>
            {item.icon && (
              <item.icon
                className={navItemIconClasses(item, { hover: true, subItem })}
                aria-hidden="true"
              />
            )}
            {item.name}
          </a>
        </Link>
      ) : item.onClick ? (
        <button
          className={navItemClasses(item, { hover: true, subItem })}
          onClick={item.onClick}
        >
          {item.icon && (
            <item.icon
              className={navItemIconClasses(item, { hover: true, subItem })}
              aria-hidden="true"
            />
          )}
          {item.name}
        </button>
      ) : (
        <div className={navItemClasses(item, { subItem })}>
          {item.icon && (
            <item.icon
              className={navItemIconClasses(item, { subItem })}
              aria-hidden="true"
            />
          )}
          {item.name}
        </div>
      )}
      {item.subItems &&
        item.subItems.map((item, i) => (
          <NavigationItem key={i} item={item} subItem={true} />
        ))}
    </>
  )
}

export default function LeftNavLayout({
  pageName,
  pageTitle,
  children,
  HeaderComponent = DefaultHeader,
  headerProps = defaultHeaderProps,
  spaceSlug,
  gardenUrl,
}) {
  const router = useRouter()
  const webId = useWebId()
  const { profile, save: saveProfile } = useMyProfile()
  const avatarImgSrc = profile && getUrl(profile, FOAF.img)
  const name = profile && getStringNoLocale(profile, FOAF.name)

  const loggedIn = useLoggedIn()
  const { logout } = useAuthentication()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false)
  const { spaces } = useSpaces(webId)

  const navigation = useMemo(
    () =>
      navigationItems({
        router,
        loggedIn,
        pageName,
        profile,
        spaces,
        webId,
        selectedSpaceSlug: spaceSlug,
        selectedGardenUrl: gardenUrl,
      }),
    [pageName, profile]
  )

  return (
    <>
      <div className="h-screen flex relative">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
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
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>

                <Transition
                  show={profileDrawerOpen}
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="translate-y-full"
                  enterTo="translate-y-0"
                  //                  leave="transition ease-in-out duration-300 transform"
                  //                  leaveFrom="translate-y-0"
                  //                  leaveTo="-translate-y-full"
                >
                  <div className="flex-1 p-4">
                    <ProfileDrawer
                      profile={profile}
                      saveProfile={saveProfile}
                      setIsOpen={setProfileDrawerOpen}
                    />
                  </div>
                </Transition>
                <Transition
                  show={!profileDrawerOpen}
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="translate-y-full"
                  enterTo="translate-y-0"
                  //                  leave="transition ease-in-out duration-300 transform"
                  //                  leaveFrom="translate-y-0"
                  //                  leaveTo="-translate-y-full"
                >
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
                        {navigation.map((item, i) => (
                          <NavigationItem key={i} item={item} />
                        ))}
                      </div>
                    </nav>
                  </div>
                </Transition>
                <AvatarSection
                  className="z-20"
                  loggedIn={loggedIn}
                  logout={logout}
                  name={name}
                  avatarImgSrc={avatarImgSrc}
                  profileDrawerOpen={profileDrawerOpen}
                  setProfileDrawerOpen={setProfileDrawerOpen}
                />
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="min-h-full hidden lg:flex lg:flex-shrink-0 z-10">
          <div className="flex flex-col w-64">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-500 border-r border-gray-200">
              <div className="flex-1 flex flex-col pb-4 overflow-y-auto">
                <div className="flex-shrink-0 px-4 relative w-52">
                  <Link href="/">
                    <a>
                      <Image
                        layout="responsive"
                        src={logoAndName}
                        alt="Mysilio"
                      />
                    </a>
                  </Link>
                </div>
                <nav className="mt-5 flex-1" aria-label="Sidebar">
                  <div className="px-2 space-y-1">
                    {navigation.map((item, i) => (
                      <NavigationItem key={i} item={item} />
                    ))}
                  </div>
                </nav>
              </div>
              <AvatarSection
                loggedIn={loggedIn}
                logout={logout}
                name={name}
                avatarImgSrc={avatarImgSrc}
                profileDrawerOpen={profileDrawerOpen}
                setProfileDrawerOpen={setProfileDrawerOpen}
              />
            </div>
          </div>
        </div>
        <Transition
          show={profileDrawerOpen}
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <aside className="hidden relative h-screen xl:flex xl:flex-col flex-shrink-0 p-4 w-96 border-r border-gray-200 bg-gray-500 overflow-y-auto z-20 lg:z-0">
            <ProfileDrawer
              profile={profile}
              saveProfile={saveProfile}
              loggedIn={loggedIn}
              logout={logout}
              setIsOpen={setProfileDrawerOpen}
            />
          </aside>
        </Transition>
        <SpaceProvider slug={spaceSlug || HomeSpaceSlug}>
          <GardenProvider url={gardenUrl}>
            <div className="h-full flex flex-col min-w-0 flex-1 overflow-y-scroll">
              <HeaderComponent
                openSidebar={useCallback(() => setSidebarOpen(true))}
                pageTitle={pageTitle}
                {...headerProps}
              />
              <div className="h-full flex-1 relative z-0 flex">
                <main className="h-full flex-1 relative z-0 focus:outline-none xl:order-last">
                  {children}
                </main>
              </div>
            </div>
          </GardenProvider>
        </SpaceProvider>
      </div>
    </>
  )
}
