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
  const { setGarden } = useGarden(nurseryUrl, webId);
  const imageUploadUri = useImageUploadUri(webId, spaceSlug);
  const fileUploadUri = useFileUploadUri(webId, spaceSlug);

  const { garden: v0Garden } = useV0Garden(webId);

  const [migrating, setMigrating] = useState(false);
  const [complete, setComplete] = useState(false);
  const [logLines, setLogLines] = useState([]);
  function log(s) {
    console.log(s);
    setLogLines([...logLines, s]);
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
    newItem = setNote(
      newItem,
      await createNoteInSpace(space, noteValue || EmptySlateJSON, { fetch })
    );
    return newItem;
  }

  async function migrate() {
    setMigrating(true);
    log('Starting Migration');
    let newGarden = createSolidDataset();
    log('Creating New Garden');
    for (const old of v0Garden) {
      console.log(old);
      if (isConcept(old)) {
        const oldUri = asUrl(old);
        const id = conceptIdFromUri(oldUri);
        const name = urlSafeIdToConceptName(id);
        const noteStorageUri = getUrl(old, US.storedAt);
        const lastEdit = getDatetime(old, DCTERMS.modified);
        const coverImage = getUrl(old, FOAF.img);
        log(`Migrating Note ${name}`);
        log(`Loading Note at ${noteStorageUri}`);
        const noteDataset = await getSolidDataset(noteStorageUri);
        const note = getThing(noteDataset, noteStorageUri);
        const noteValue = getAndParseNoteBody(note);
        log(`Adding Note to Garden ${name}`);
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
        log(`Migrating Image ${title}`);
        log(`Loading Image at ${url}`);
        const image = await getFile(url, { fetch });
        const imagename = url.substring(url.lastIndexOf('/') + 1);
        const newImageUrl = `${imageUploadUri}${imagename}`;
        log(`Saving New Image at ${newUrl}`);
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
        log(`Added Image to Garden ${title}`);
      } else if (isBookmarkedFile(old)) {
        const url = asUrl(old);
        const title = getStringNoLocale(old, DCTERMS.title);
        const lastEdit = getDatetime(old, DCTERMS.modified);
        const description = getStringNoLocale(old, DCTERMS.description);
        log(`Loading File at ${url}`);
        const file = await getFile(url, { fetch });
        const filename = url.substring(url.lastIndexOf('/') + 1);
        const newFileUrl = `${fileUploadUri}${filename}`;
        log(`Saving New File at ${newFileUrl}`);
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
        log(`Added File to Garden ${title}`);
      } else if (isBookmarkedLink(old)) {
        const url = asUrl(old);
        const title = getStringNoLocale(old, DCTERMS.title);
        const lastEdit = getDatetime(old, DCTERMS.modified);
        const description = getStringNoLocale(old, DCTERMS.description);
        const coverImage = getUrl(old, FOAF.depiction);
        log(`Migrating Bookmark ${title}`);
        const newItem = await createNewItem({
          title,
          lastEdit,
          description,
          coverImage,
          url,
        });
        newGarden = setThing(newGarden, newItem);
        log(`Adding Bookmark to Garden ${title}`);
      }
    }
    log('Saving New Garden to Pod');
    setGarden(newGarden);
    log('Migration Complete!');
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
                {logLines.map((line) => {
                  <p className="text-l pb-6">{line}</p>;
                })}
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
