import { MenuIcon } from '@heroicons/react/outline';

export default function DefaultHeader({ openSidebar, pageTitle = "" }) {

  return (
    <div>
      <div className="min-h-12 flex justify-between bg-header-gradient px-6 py-1.5">
        <div className="text-white text-2xl font-black">
          {pageTitle}
        </div>
        <div>
          <button
            type="button"
            className="lg:hidden -mr-3 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-200 hover:text-white"
            onClick={openSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
