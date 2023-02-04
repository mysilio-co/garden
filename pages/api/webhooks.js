import { resources } from 'rdf-namespaces/dist/cal';
import { verifyAuthIssuer } from 'solid-webhook-client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Webhook POST received');
    console.log(req.body);
    const updatedResource = req.body.object.id;
    const resourceOrigin = new URL(updatedResource).origin;
    const verifiedIssuer = await verifyAuthIssuer(req.headers.authorization);
    if (verifiedIssuer === resourceOrigin) {
      console.log('Webhook valid');
      console.log(req.body);
      return res.status(200);
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
