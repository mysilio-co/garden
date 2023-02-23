import { classNames } from '../utils/html'

const tabs = [
  { name: 'Links', slug: 'links', currentClassName: 'bg-my-green' },
  { name: 'Tags', slug: 'tags', currentClassName: 'bg-my-orange' },
]

export default function ConnectionsTabs({ onChange, active }) {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          defaultValue={tabs.find((tab) => tab.slug === active).name}
          onChange={(e) => onChange(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.name} className={tab.className} value={tab.slug}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4 bg-gray-300 p-1" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              href={tab.href}
              className={classNames(
                active === tab.slug
                  ? `text-white ${tab.currentClassName}`
                  : 'text-gray-50',
                'leading-4 px-3 py-2 font-medium text-sm rounded-md'
              )}
              onClick={() => onChange(tab.slug)}
              aria-current={tab.current ? 'page' : undefined}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
