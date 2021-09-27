import { Formik } from 'formik';
import { Search as SearchIcon } from './icons';
import { IconInput } from './inputs';
import { Logo } from './logo';
import Avatar from './Avatar';

export default function Header({avatarImgSrc}) {
  return (
    <nav className="bg-my-green rounded-b-2xl flex flex-row justify-between h-18 items-center">
      <div className="flex flex-row items-center">
        <div className="w-18 flex flex-col justify-center items-center">
          <Logo className='w-7 transform scale-105' />
        </div>
        <Formik>
          <IconInput type="search" name="search" placeholder="Search"
            icon={<SearchIcon className="text-white" />}
            inputClassName="ipt-header-search" />
        </Formik>
      </div>
      <div className="flex flex-row mr-12">
        New
        <Avatar src={avatarImgSrc} />
      </div>
    </nav>
  )
}