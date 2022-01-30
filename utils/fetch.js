import { fetch } from "@inrupt/solid-client-authn-browser";
import {
  setThing,
  createSolidDataset,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";

export async function postFormData(uri, body) {
  const formBody = [];
  for (var key in body) {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(body[key]);
    formBody.push(encodedKey + "=" + encodedValue);
  }

  return fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: formBody.join("&"),
  });
}

const SolidServerURI = "https://mysilio.me";

export async function sendMagicLink(username, email, password) {
  const magicLinkURI = SolidServerURI + "/magic-link/generate";
  console.log("Sending magic link to " + email);
  return postFormData(magicLinkURI, {
    username,
    email,
    password,
    returnToUrl: `https://mysilio.garden/login/${username}.mysilio.me`,
  });
}

export async function deleteResource(uri) {
  return fetch(uri, {
    method: "DELETE",
  });
}

export async function saveResource(url, newDataset) {
  if (url) {
    const savedDataset = await saveSolidDatasetAt(url, newDataset, { fetch });
    return savedDataset;
  } else {
    throw new Error(`could not save dataset with uri of ${uri}`);
  }
}

export async function saveThing(url, newThing, resource) {
  const newDataset = setThing(resource || createSolidDataset(), newThing);
  return saveResource(url, newDataset);
}
