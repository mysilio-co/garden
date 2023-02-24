import { asUrl, getUrl } from '@inrupt/solid-client'
import {
  gardenMetadataInSpacePrefs,
  getSpace,
  getTitle,
  HomeSpaceSlug,
  MY,
  useSpaces,
  useWebhooks,
} from 'garden-kit'
import { useWebId } from 'swrlit'
import { useMemo } from 'react'
import { fuseWebhookUrl } from '../../model/search'

export default function Webhooks({ ...props }) {
  const { webhooks, addWebhookSubscription, unsubscribeFromWebhook } =
    useWebhooks()

  const webId = useWebId()
  const { spaces } = useSpaces(webId)

  // For simplicity, only setup Gnomes for the Gardens in the user's Home space.
  // Community Gnomes should be configured by logging in as the Community Pod.
  const home = spaces && getSpace(spaces, HomeSpaceSlug)
  const gardens = gardenMetadataInSpacePrefs(home, spaces)

  async function enableAll() {
    for (const garden of gardens) {
      const gardenUrl = asUrl(garden)
      await enable(gardenUrl)
    }
  }
  async function disableAll() {
    for (const gardenUrl of enabled) {
      await disable(gardenUrl)
    }
  }

  async function enable(gardenUrl) {
    await addWebhookSubscription(gardenUrl, fuseWebhookUrl(gardenUrl))
  }
  async function disable(gardenUrl) {
    await unsubscribeFromWebhook(getWebhook(gardenUrl))
  }
  async function toggle(gardenUrl) {
    if (getWebhook(gardenUrl)) disable(gardenUrl)
    else enable(gardenUrl)
  }
  async function toggleAll() {
    if (enabled.length > 0) disableAll()
    else enableAll()
  }

  function getWebhook(gardenUrl) {
    return webhooks.find(
      (webhook) => getUrl(webhook, MY.Garden.subscribedTo) == gardenUrl
    )
  }

  const enabled = useMemo(() => {
    let enabled = []
    for (const garden of gardens) {
      const gardenUrl = asUrl(garden)
      const webhook = getWebhook(gardenUrl)
      if (webhook && getDeliveryHost(webhook) === window.location.host) {
        enabled = [...enabled, gardenUrl]
      }
    }
    return enabled
  }, [webhooks, gardens])

  return (
    <div {...props}>
      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            name="gnomes"
            type="checkbox"
            checked={enabled.length > 0}
            onChange={toggleAll}
            className="h-4 w-4 rounded border-gray-300 text-purple-500 focus:ring-purple-400"
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-medium text-purple-300">
            Enable Garden Gnomes
          </label>
          <p className="text-gray-400 text-xs">
            Garden Gnomes help keep your digital garden clean, and are required
            for advanced features like full-text search. Enabling Gnomes tells
            your Solid pod to send the Mysilio app updates using webhooks
            anytime data is changed. This helps us us keep things up to date. We
            only set up webhooks for the specific files we need to watch, and
            you can disable them at any time.
          </p>
        </div>
      </div>
      {enabled.length > 0 &&
        gardens &&
        gardens.map((garden) => {
          return (
            <div key={asUrl(garden)} className="ml-6">
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    name={getTitle(garden)}
                    type="checkbox"
                    checked={enabled.includes(asUrl(garden))}
                    onChange={() => {
                      toggle(asUrl(garden))
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-purple-500 focus:ring-purple-400"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-small text-purple-300">
                    {getTitle(garden)} Search Gnome
                  </label>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
