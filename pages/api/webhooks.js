import { verifyAuthIssuer } from 'solid-webhook-client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Webhook request');
    if (
      (await verifyAuthIssuer(req.headers.authorization)) === req.body.origin
    ) {
      console.log('Webhook valid');
      console.log(req.body);
    } else {
      console.log('This issuer is invalid');
    }

    res.status(200);
  } else {
    return res
      .status(405)
      .json({ message: 'The webhooks handler only accepts POST requests' });
  }
}
