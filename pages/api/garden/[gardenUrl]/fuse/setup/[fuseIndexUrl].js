import { Session } from '@inrupt/solid-client-authn-node';
import { setupGardenSearchIndex } from '../../../../../../model/search';

const ClientID = process.env.MKG_CLIENT_ID;
const ClientSecret = process.env.MKG_CLIENT_SECRET;
const IDP = process.env.MKG_IDP;

export default async function handler(req, res) {
  console.log('Deconstructing query params');
  const { gardenUrl, fuseIndexUrl } = req.query;
  const decodedGardenUrl = decodeURI(gardenUrl);
  const decodedFuseIndexUrl = decodeURI(fuseIndexUrl);

  if (req.method === 'GET') {
    console.log(
      `Setting up fuse index for garden ${decodedGardenUrl} at ${decodedFuseIndexUrl}`
    );
    const session = new Session();
    await session.login({
      clientId: ClientID,
      clientSecret: ClientSecret,
      oidcIssuer: IDP,
    });
    const { fetch, info } = session;
    console.log(`Authenticated as ${info.webId}`);
    await setupGardenSearchIndex(decodedGardenUrl, decodedFuseIndexUrl, {
      fetch,
    });
    return res.status(200).json({ message: 'OK' });
  } else {
    return res
      .status(405)
      .json({ message: 'The fuse setup handler only accepts GET requests' });
  }
}
