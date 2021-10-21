import { useState, useEffect } from 'react'
import { useWebId } from 'swrlit'
import { getBoolean, setBoolean } from '@inrupt/solid-client';

import Nav from '../components/nav'
import WebMonetization from '../components/WebMonetization'
import { US } from '../vocab'
import { useAppSettings, useDevMode } from '../hooks/app'

function SettingToggle({ settings, predicate, onChange, label, description }) {
  const [value, setValue] = useState()
  const currentValue = getBoolean(settings, predicate)
  useEffect(() => {
    currentValue && setValue(currentValue)
  }, [currentValue])
  function toggle() {
    const newValue = !value
    setValue(newValue)
    onChange && onChange(setBoolean(settings, predicate, newValue))
  }
  return (
    <div className="flex flex-row justify-between">
      <div>
        <div className="text-sm font-medium text-gray-900">
          {label}
        </div>
        <div className="text-sm text-gray-500">
          {description}
        </div>
      </div>

      <button type="button"
        onClick={toggle}
        className={`${value ? "bg-indigo-600" : "bg-gray-200"} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        aria-pressed="false" aria-labelledby="availability-label">
        <span className="sr-only">Use setting</span>

        <span aria-hidden="true" className={`${value ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
      </button>
    </div>
  )
}

function SectionHeader({ title, description }) {
  return (
    <div className="mt-6">
      <h2 className="text-3xl font-large text-gray-900 mb-3">
        {title}
      </h2>
      <p className="">
        {description}
      </p>
    </div>
  )
}

export default function Profile() {
  const webId = useWebId()
  const { settings, save } = useAppSettings(webId)
  function onChange(newSettings) {
    save(newSettings)
  }
  return (
    <div className="page">
      <WebMonetization webId={webId} />
      <Nav />
      <h1 className="text-5xl text-center mb-12">Settings</h1>
      <div className="mx-36">
        <SectionHeader title="Miscellaneous" description="" />
        {settings && (
          <SettingToggle
            settings={settings}
            predicate={US.devMode}
            onChange={onChange}
            label="Developer Mode"
            description="Seatbelts off, maximum information."
          />
        )}
      </div>
    </div>
  );
}
