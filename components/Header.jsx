import { Formik } from 'formik';
import { Search as SearchIcon } from './icons';
import { IconInput } from './inputs';
import { Logo } from './logo';
import Avatar from './Avatar';
import Dropdown from '../components/Dropdown';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Header({ avatarImgSrc }) {
  return (
    <nav className="bg-my-green rounded-b-2xl flex flex-row justify-between h-18 items-center">
      <div className="flex flex-row items-center">
        <div className="w-18 flex flex-col justify-center items-center">
          <Logo className='w-7 transform scale-105' />
        </div>
        <Formik>
          <IconInput type="search" name="search" placeholder="Search"
            icon={<SearchIcon className="ipt-header-search-icon" />}
            inputClassName="ipt-header-search" />
        </Formik>
      </div>
      <div className="flex flex-row items-center">
        <Dropdown label="New" >
          <Dropdown.Items className="origin-top-left absolute right-0 mt-2 w-52 rounded-lg shadow-menu text-xs bg-white focus:outline-none">
            <div className="uppercase text-gray-300 text-xs mt-2.5 px-4">
              Create New
            </div>
            <Dropdown.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Note
                </a>
              )}
            </Dropdown.Item>
          </Dropdown.Items>
        </Dropdown>
        <Avatar src={avatarImgSrc} className="mx-1 w-12 h-12" />
      </div>
    </nav>
  )
}