import { verifyAuthIssuer } from 'solid-webhook-client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Webhook POST received');
    if (
      (await verifyAuthIssuer(req.headers.authorization)) === req.body.origin
    ) {
      console.log('Webhook valid');
      console.log(req.body);
      return res.status(200);
    } else {
      const m = `This authorization header of this webhook is invalid. Header ${req.headers.authorization} does not match orign ${origin}`;
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
