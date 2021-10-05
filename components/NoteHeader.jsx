import { Logo } from './logo';
import Avatar from './Avatar';
import { NoteVisibilityToggle } from './toggles';
import { Send as SendIcon } from './icons';
import { Button } from './buttons';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function NoteHeader({ avatarImgSrc, username, noteTitle, noteCreatedAt, noteLastEdit, visibility, noteUrl }) {
  return (
    <nav className="bg-my-green b-2xl flex flex-row h-32">
      <div className="flex flex-row items-center">
        <div className="w-18">
          <Logo className='w-12 -ml-2.5 transform scale-150 opacity-20' />
        </div>
      </div>
      <div className="flex flex-row flex-col items-left">
        <div className="mt-6 text-white text-4xl font-black">{noteTitle}</div>
        <div className="flex flex-row mt-2 h-3 text-sm text-white">
          <Avatar src={avatarImgSrc} className="h-6 w-6" />
          <div className="flex flex-row mt-1">
            <div className="ml-2 font-bold text-my-yellow">{username}</div>
            <div className="ml-2 opacity-50" text>
              <b>Created</b> {noteCreatedAt}
            </div>
            <div className="ml-2 opacity-50">
              <b>Last Edit</b> {noteLastEdit}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-48 absolute mt-6 right-0 mr-16">
        <div className="flex flex-row h-10 w-full">
          <NoteVisibilityToggle className="h-6 mr-8 w-20" enabled={visibility} />
          <button type="button" class="ml-7 inline-flex items-center p-2.5 bg-white-a10 border border-white shadow-sm text-sm font-medium rounded-3xl text-white">
            <span>
              Share
            </span>
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}