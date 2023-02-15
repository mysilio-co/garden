import {
  asUrl,
  createAcl,
  createAclFromFallbackAcl,
  createSolidDataset,
  getResourceInfoWithAcl,
  getUrl,
  hasAccessibleAcl,
  hasFallbackAcl,
  hasResourceAcl,
  overwriteFile,
  saveAclFor,
  saveSolidDatasetAt,
} from '@inrupt/solid-client';
import {
  gardenMetadataInSpacePrefs,
  getSpace,
  getTitle,
  HomeSpaceSlug,
  MY,
  useSpaces,
  useWebhooks,
} from 'garden-kit';
import { useWebId, useAuthentication, RevokedAccess } from 'swrlit';
import { useMemo } from 'react';
import {
  defaultFuseIndexUrl,
  fuseWebhookUrl,
  setupGardenSearchIndex,
  setupGardenSearchIndexAPI,
} from '../../model/search';
import { setAgentAccess } from '@inrupt/solid-client/universal';

export const MysilioKnowledgeGnome =
  process.env.NEXT_PUBLIC_MKG_WEBID || 'https://mysilio.me/mkg/profile/card#me';

async function ensureAcl(resourceUrl, options) {
  if (resourceUrl) {
    let resourceWithAcl;
    try {
      resourceWithAcl = await getResourceInfoWithAcl(resourceUrl, options);
    } catch (e) {
      if (e.statusCode === 404) {
        // create empty file
        await overwriteFile(resourceUrl, new Blob([]), options);
        resourceWithAcl = await getResourceInfoWithAcl(resourceUrl, options);
      } else {
        throw e;
      }
    }
    if (!hasAccessibleAcl(resourceWithAcl)) {
      throw new Error(
        'The current user does not have permission to change access rights to this Resource.'
      );
    }
    if (!hasResourceAcl(resourceWithAcl)) {
      let acl;
      if (hasFallbackAcl(resourceWithAcl)) {
        acl = createAclFromFallbackAcl(resourceWithAcl);
      } else {
        acl = createAcl(resourceWithAcl);
      }
      await saveAclFor(resourceWithAcl, acl, options);
    }
  } else {
    throw new Error('Cannot ensureAcl for undefined resource');
  }
}

export default function Webhooks({ profile, saveProfile, ...props }) {
  const { fetch } = useAuthentication();
  const { webhooks, addWebhookSubscription, unsubscribeFromWebhook } =
    useWebhooks();

  const webId = useWebId();
  const { spaces } = useSpaces(webId);

  // For simplicity, only setup Gnomes for the Gardens in the user's Home space.
  // Community Gnomes should be configured by logging in as the Community Pod.
  const home = spaces && getSpace(spaces, HomeSpaceSlug);
  const gardens = gardenMetadataInSpacePrefs(home, spaces);

  function getFuseIndexUrl(gardenUrl) {
    const gardenMetadata = gardens.find((garden) => {
      return asUrl(garden) === gardenUrl;
    });
    return (
      (gardenMetadata && getUrl(gardenMetadata, MY.Garden.hasFuseIndex)) ||
      defaultFuseIndexUrl(gardenUrl)
    );
  }

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
    await ensureAcl(gardenUrl, { fetch });
    await setAgentAccess(
      gardenUrl,
      MysilioKnowledgeGnome,
      { read: true, write: true },
      { fetch }
    );

    await ensureAcl(getFuseIndexUrl(gardenUrl), { fetch });
    await setAgentAccess(
      getFuseIndexUrl(gardenUrl),
      MysilioKnowledgeGnome,
      { read: true, write: true },
      { fetch }
    );

    await setupGardenSearchIndexAPI(gardenUrl, getFuseIndexUrl(gardenUrl), {
      fetch,
    });
    await addWebhookSubscription(gardenUrl, fuseWebhookUrl(gardenUrl));
  }
  async function disable(gardenUrl) {
    await unsubscribeFromWebhook(getWebhook(gardenUrl));
    await setAgentAccess(gardenUrl, MysilioKnowledgeGnome, RevokedAccess, {
      fetch,
    });

    await setAgentAccess(
      getFuseIndexUrl(gardenUrl),
      MysilioKnowledgeGnome,
      RevokedAccess,
      { fetch }
    );
  }
  async function toggle(gardenUrl) {
    if (getWebhook(gardenUrl)) disable(gardenUrl);
    else enable(gardenUrl);
  }
  async function toggleAll() {
    if (enabled.length > 0) disableAll();
    else enableAll();
  }

  function getWebhook(gardenUrl) {
    return webhooks.find(
      (webhook) => getUrl(webhook, MY.Garden.subscribedTo) == gardenUrl
    );
  }

  const enabled = useMemo(() => {
    let enabled = [];
    for (const garden of gardens) {
      const gardenUrl = asUrl(garden);
      if (getWebhook(gardenUrl)) {
        enabled = [...enabled, gardenUrl];
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
            Garden Gnomes help keep your Gardens clean, and are required for
            advanced features like full-text search.
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
                      toggle(asUrl(garden));
                    }}
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
        })}
    </div>
  );
}
