import { verifyAuthIssuer } from 'solid-webhook-client';
import { Session } from '@inrupt/solid-client-authn-node';
import { updateGardenSearchIndex } from '../../../../../model/search';

const ClientID = process.env.MKG_CLIENT_ID;
const ClientSecret = process.env.MKG_CLIENT_SECRET;
const IDP = process.env.MKG_IDP;

export default async function handler(req, res) {
  const { gardenUrl } = req.query;
  const decodedGardenUrl = decodeURIComponent(gardenUrl);

  const session = new Session();
  await session.login({
    clientId: ClientID,
    clientSecret: ClientSecret,
    oidcIssuer: IDP,
  });
  const { fetch } = session;

  if (req.method === 'POST') {
    console.log('Webhook POST received');
    console.log(req.body);
    const updatedResource = req.body.object.id;
    const resourceOrigin = new URL(updatedResource).origin;
    const verifiedIssuer = await verifyAuthIssuer(req.headers.authorization);
    if (verifiedIssuer === resourceOrigin) {
      if (updatedResource === decodedGardenUrl) {
        await updateGardenSearchIndex(updatedResource, { fetch });
        return res.status(200).json({ message: 'OK' });
      } else {
        const m = `Received webhook for a different garden. Garden Url of api ${decodedGardenUrl} does not match resource url of webhook ${updatedResource}`;
        console.log(m);
        return res.status(400).json({
          message: m,
        });
      }
    } else {
      const m = `This authorization header of this webhook is invalid. Header ${verifiedIssuer} does not match orign ${resourceOrigin}`;
      console.log(m);
      return res.status(401).json({
        message: m,
      });
    }
  } else {
    return res
      .status(405)
      .json({ message: 'The webhooks handler only accepts POST requests' });
  }
}
