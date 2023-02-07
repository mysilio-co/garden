import { asUrl, getUrl } from '@inrupt/solid-client';
import {
  gardenMetadataInSpacePrefs,
  getSpace,
  getTitle,
  HomeSpaceSlug,
  MY,
  useSpaces,
  useWebhooks,
} from 'garden-kit';
import {
  useWebId,
  useAgentAccess,
  usePublicAccess,
  ensureAcl,
  useAuthentication,
} from 'swrlit';
import { useMemo } from 'react';
import { useEffect } from 'react';

export const MysilioKnowledgeGnome =
  process.env.NEXT_PUBLIC_MKG_WEBID || 'https://mysilio.me/mkg/profile/card#me';

export function GardenWebhook({ garden, enabled, toggle }) {
  const { ensureAccess, revokeAccess } = useAgentAccess(
    asUrl(garden),
    MysilioKnowledgeGnome
  );
  async function updateAccess() {
    if (enabled) {
      await ensureAccess({ read: true, write: true });
    } else {
      await revokeAccess();
    }
  }
  useEffect(() => {
    updateAccess();
  }, [garden, enabled]);
  return (
    <div className="ml-6">
      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            name={getTitle(garden)}
            type="checkbox"
            checked={enabled}
            onChange={toggle}
            className="h-4 w-4 rounded border-gray-300 text-purple-500 focus:ring-purple-400"
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-small text-purple-300">
            {getTitle(garden)}
          </label>
        </div>
      </div>
    </div>
  );
}

export default function Webhooks({ profile, saveProfile, ...props }) {
  const { webhooks, addWebhookSubscription, unsubscribeFromWebhook } =
    useWebhooks();

  const webId = useWebId();
  const { spaces } = useSpaces(webId);

  // For simplicity, only setup Gnomes for the Gardens in the user's Home space.
  // Community Gnomes should be configured by logging in as the Community Pod.
  const home = spaces && getSpace(spaces, HomeSpaceSlug);
  const gardens = gardenMetadataInSpacePrefs(home, spaces);

  async function enableAll() {
    for (const garden of gardens) {
      const gardenUrl = asUrl(garden);
      await enable(gardenUrl);
    }
  }
  async function disableAll() {
    for (const gardenUrl of enabled) {
      await disable(gardenUrl);
    }
  }

  async function enable(gardenUrl) {
    await addWebhookSubscription(
      gardenUrl,
      `https://${window.location.host}/api/webhooks`
    );
  }
  async function disable(gardenUrl) {
    await unsubscribeFromWebhook(getWebhook(gardenUrl));
  }
  async function toggle(gardenUrl) {
    if (getWebhook(gardenUrl)) disable(gardenUrl);
    else enable(gardenUrl);
  }
  async function toggleAll() {
    if (enabled.size > 0) disableAll();
    else enableAll();
  }

  function getWebhook(gardenUrl) {
    return webhooks.find(
      (webhook) => getUrl(webhook, MY.Garden.subscribedTo) == gardenUrl
    );
  }

  const enabled = useMemo(() => {
    const enabled = new Set();
    for (const garden of gardens) {
      const gardenUrl = asUrl(garden);
      if (getWebhook(gardenUrl)) {
        enabled.add(gardenUrl);
      }
    }
    console.log(enabled);
    return enabled;
  }, [webhooks, gardens]);

  return (
    <div {...props}>
      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            name="gnomes"
            type="checkbox"
            checked={enabled.size > 0}
            onChange={toggleAll}
            className="h-4 w-4 rounded border-gray-300 text-purple-500 focus:ring-purple-400"
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-medium text-purple-300">
            Enable Garden Gnomes
          </label>
          <p className="text-gray-400 text-xs">
            Garden Gnomes help keep your Gardens clean, and are required for
            advanced features like full-text search.
          </p>
        </div>
      </div>
      {enabled.size > 0 &&
        gardens &&
        gardens.map((garden) => {
          return (
            <GardenWebhook
              key={asUrl(garden)}
              garden={garden}
              enabled={enabled.has(asUrl(garden))}
              toggle={() => {
                toggle(asUrl(garden));
              }}
            />
          );
        })}
    </div>
  );
}
