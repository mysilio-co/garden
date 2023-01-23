import { useLoggedIn, useWebId } from 'swrlit/contexts/authentication';
import Header from '../components/GardenHeader';
import Login from '../components/Login';
import {
  createItem,
  createNoteInSpace,
  getNurseryFile,
  HomeSpaceSlug,
  setNote,
  setReferences,
  setTags,
  useGarden,
  useSpace,
  setDepiction,
  setFile,
  setImage,
  setDescription,
  EmptySlateJSON,
  setBookmark,
  getTitle,
  setTitle,
  getUUID,
} from 'garden-kit';
import { useGarden as useV0Garden } from '../hooks/concepts';
import {
  asUrl,
  createSolidDataset,
  getContentType,
  getDatetime,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getUrl,
  getFile,
  overwriteFile,
  setDatetime,
  setThing,
} from '@inrupt/solid-client';
import { conceptIdFromUri } from '../model/concept';
import { urlSafeIdToConceptName } from '../utils/uris';
import {
  isBookmarkedFile,
  isBookmarkedImage,
  isBookmarkedLink,
  isConcept,
} from '../utils/rdf';
import { useState } from 'react';
import { DCTERMS, FOAF } from '@inrupt/vocab-common-rdf';
import { US } from '../vocab';
import { getAndParseNoteBody } from '../model/note';
import { getReferencesInNote, getTagsInNote } from '../utils/slate';
import { useAuthentication } from 'swrlit';
import { useFileUploadUri, useImageUploadUri } from '../hooks/uris';

export default function MigrateV0Data() {
  const loggedIn = useLoggedIn();
  const webId = useWebId();
  const { fetch } = useAuthentication();

  const slug = HomeSpaceSlug;
  const { space } = useSpace(webId, slug);
  const nurseryUrl = space && getNurseryFile(space);
  const { garden, saveGarden } = useGarden(nurseryUrl, webId);
  const imageUploadUri = useImageUploadUri(webId, HomeSpaceSlug);
  const fileUploadUri = useFileUploadUri(webId, HomeSpaceSlug);

  const { garden: v0Garden } = useV0Garden(webId);

  const [migrating, setMigrating] = useState(false);
  const [complete, setComplete] = useState(false);
  const [logLines, setLogLines] = useState([]);
  function log(lines, s) {
    const newLines = [...lines, s];
    setLogLines(newLines);
    return newLines;
  }

  async function createNewItem({
    title,
    description,
    coverImage,
    url,
    file,
    noteValue,
    lastEdit,
  }) {
    let newItem = createItem(webId, { title, description });
    if (!getTitle(newItem)) {
      // ID: For some reason, some of my old garden items didn't have titles
      // so just used the UUID genearted if it's untitled
      newItem = setTitle(newItem, getUUID(newItem));
    }
    setDatetime(newItem, DCTERMS.modified, lastEdit);
    if (coverImage) {
      newItem = setDepiction(newItem, coverImage);
      newItem = setImage(newItem, coverImage);
    }
    if (url) {
      newItem = setBookmark(newItem, url);
    }
    if (file) {
      newItem = setFile(newItem, file);
    }
    if (noteValue) {
      newItem = setTags(newItem, getTagsInNote(noteValue));
      newItem = setReferences(newItem, getReferencesInNote(noteValue));
    }
    if (description) {
      newItem = setDescription(newItem, description);
    }
    newItem = setNote(
      newItem,
      await createNoteInSpace(space, noteValue || EmptySlateJSON, { fetch })
    );
    return newItem;
  }

  async function migrate() {
    setMigrating(true);
    let ll = logLines;
    ll = log(ll, 'Starting Migration');
    let newGarden = garden;
    ll = log(ll, 'Creating New Garden');
    for (const old of v0Garden) {
      try {
        console.log('Old item:');
        console.log(old);
        if (isConcept(old)) {
          const oldUri = asUrl(old);
          const id = conceptIdFromUri(oldUri);
          const name = urlSafeIdToConceptName(id);
          const noteStorageUri = getUrl(old, US.storedAt);
          const lastEdit = getDatetime(old, DCTERMS.modified);
          const coverImage = getUrl(old, FOAF.img);
          ll = log(ll, `Migrating Note ${name}`);
          ll = log(ll, `Loading Note at ${noteStorageUri}`);
          const noteDataset = await getSolidDataset(noteStorageUri, { fetch });
          const note = getThing(noteDataset, noteStorageUri);
          const noteValue = getAndParseNoteBody(note);
          ll = log(ll, `Adding Note to Garden ${name}`);
          const newItem = await createNewItem({
            title: name,
            lastEdit,
            coverImage,
            noteValue,
          });
          newGarden = setThing(newGarden, newItem);
        } else if (isBookmarkedImage(old)) {
          const title = getStringNoLocale(old, DCTERMS.title);
          const lastEdit = getDatetime(old, DCTERMS.modified);
          const url = asUrl(old);
          ll = log(ll, `Migrating Image ${title}`);
          ll = log(ll, `Loading Image at ${url}`);
          const image = await getFile(url, { fetch });
          const imagename = url.substring(url.lastIndexOf('/') + 1);
          const newImageUrl = `${imageUploadUri}${imagename}`;
          ll = log(ll, `Saving New Image at ${newImageUrl}`);
          await overwriteFile(newImageUrl, image, {
            contentType: getContentType(image),
            fetch,
          });
          const newItem = await createNewItem({
            title,
            lastEdit,
            coverImage: newImageUrl,
          });
          newGarden = setThing(newGarden, newItem);
          ll = log(ll, `Added Image to Garden ${title}`);
        } else if (isBookmarkedFile(old)) {
          const url = asUrl(old);
          const title = getStringNoLocale(old, DCTERMS.title);
          const lastEdit = getDatetime(old, DCTERMS.modified);
          const description = getStringNoLocale(old, DCTERMS.description);
          ll = log(ll, `Loading File at ${url}`);
          const file = await getFile(url, { fetch });
          const filename = url.substring(url.lastIndexOf('/') + 1);
          const newFileUrl = `${fileUploadUri}${filename}`;
          ll = log(ll, `Saving New File at ${newFileUrl}`);
          await overwriteFile(newFileUrl, file, {
            contentType: getContentType(file),
            fetch,
          });
          const newItem = await createNewItem({
            title,
            lastEdit,
            description,
            file: newFileUrl,
          });
          newGarden = setThing(newGarden, newItem);
          ll = log(ll, `Added File to Garden ${title}`);
        } else if (isBookmarkedLink(old)) {
          const url = asUrl(old);
          const title = getStringNoLocale(old, DCTERMS.title);
          const lastEdit = getDatetime(old, DCTERMS.modified);
          const description = getStringNoLocale(old, DCTERMS.description);
          const coverImage = getUrl(old, FOAF.depiction);
          ll = log(ll, `Migrating Bookmark ${title}`);
          const newItem = await createNewItem({
            title,
            lastEdit,
            description,
            coverImage,
            url,
          });
          newGarden = setThing(newGarden, newItem);
          ll = log(ll, `Adding Bookmark to Garden ${title}`);
        }
        ll = log(ll, 'Saving new Item');
        // Must save incrementally, or else the PATCH is too lage.
        saveGarden(newGarden);
      } catch (e) {
        console.error(e);
        continue;
      }
    }
    ll = log(ll, 'Migration Complete!');
    setComplete(true);
    setMigrating(false);
  }

  return (
    <div className="page" id="page">
      {loggedIn === true ? (
        <>
          <Header />
          <div className="text-center pt-12 flex flex-col items-center">
            {complete ? (
              <h3 className="text-xl pb-6">Your v0 data has been migrated!</h3>
            ) : migrating ? (
              <>
                <h3 className="text-xl pb-6">Migrating...</h3>
                {logLines.map((line, i) => (
                  <p key={i} className="text-l pb-6">
                    {line}
                  </p>
                ))}
              </>
            ) : (
              <>
                <h3 className="text-xl pb-6">
                  Time to migrate your data! Press the button below to get
                  started.
                </h3>
                <button
                  className="btn-filled btn-md btn-square font-bold"
                  onClick={migrate}
                >
                  Migrate your v0 data
                </button>
              </>
            )}
          </div>
        </>
      ) : loggedIn === false || loggedIn === null ? (
        <div className="text-center">
          <Login />
        </div>
      ) : (
        <Loader className="flex flex-row justify-center mt-36" />
      )}
    </div>
  );
}
