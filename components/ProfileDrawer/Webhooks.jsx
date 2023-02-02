import { useEffect, useState } from 'react';
import { getUrl } from '@inrupt/solid-client';
import {
  getContainer,
  getSpace,
  HomeSpaceSlug,
  MY,
  useSpaces,
  useWebhooks,
} from 'garden-kit';
import { useWebId } from 'swrlit';

export default function Webhooks({ profile, saveProfile, ...props }) {
  const { webhooks, addWebhookSubscription, unsubscribeFromWebhook } =
    useWebhooks();

  const webId = useWebId();
  const { spaces } = useSpaces(webId);
  // for simplicity, only Gnomes for the Home space can be setup here.
  // Community Gnomes should be configured manually.
  const home = spaces && getSpace(spaces, HomeSpaceSlug);
  const homeContainer = getContainer(home);

  const homeSpaceWebhooks = webhooks.filter(
    (webhook) => getUrl(webhook, MY.Garden.subscribedTo) == homeContainer
  );
  console.log(webhooks);

  useEffect(() => {
    if (homeSpaceWebhooks.length > 0) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [homeSpaceWebhooks]);

  const [enabled, setEnabled] = useState(false);

  async function onChange() {
    if (!enabled) {
      await addWebhookSubscription(
        homeContainer,
        `https://${window.location.host}/api/webhooks`
      );
    } else {
      const homeSpaceWebhooks = webhooks.filter(
        (webhook) => getUrl(webhook, MY.Garden.subscribedTo) == homeContainer
      );
      for (const webhook of homeSpaceWebhooks) {
        await unsubscribeFromWebhook(webhook);
      }
    }
  }

  return (
    <div {...props}>
      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            name="gnomes"
            type="checkbox"
            value={enabled}
            onChange={onChange}
            className="h-4 w-4 rounded border-gray-300 text-purple-500 focus:ring-purple-400"
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-medium text-purple-300">
            Enable Garden Gnomes {enabled}
          </label>
          <p className="text-gray-400 text-xs">
            Garden Gnomes help keep your Gardens clean, and are necessay for
            advanced features like full-text search.
          </p>
        </div>
      </div>
    </div>
  );
}