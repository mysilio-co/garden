import { Session } from '@inrupt/solid-client-authn-node';
import { setupGardenSearchIndex } from '../../../../../../model/search';

const ClientID = process.env.MKG_CLIENT_ID;
const ClientSecret = process.env.MKG_CLIENT_SECRET;
const IDP = process.env.MKG_IDP;

export default async function handler(req, res) {
  const { gardenUrl, fuseIndexUrl } = req.query;
  const decodedGardenUrl = decodeURIComponent(gardenUrl);
  const decodedFuseIndexUrl = decodeURIComponent(fuseIndexUrl);

  if (req.method === 'POST') {
    console.log(
      `Setting up fuse index for garden ${decodedGardenUrl} at ${decodedFuseIndexUrl}`
    );
    const session = new Session();
    await session.login({
      clientId: ClientID,
      clientSecret: ClientSecret,
      oidcIssuer: IDP,
    });
    const { fetch } = session;
    await setupGardenSearchIndex(decodedGardenUrl, decodedFuseIndexUrl, {
      fetch,
    });
    return res.status(200).json({ message: 'OK' });
  } else {
    return res
      .status(405)
      .json({ message: 'The fuse setup handler only accepts POST requests' });
  }
}
