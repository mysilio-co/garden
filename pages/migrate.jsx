import { useLoggedIn, useWebId } from 'swrlit/contexts/authentication'
import Header from '../components/GardenHeader';
import Login from '../components/Login'
import { createItem, getItemAll, getNurseryFile, HomeSpaceSlug, useGarden, useSpace } from 'garden-kit';
import { useGarden as useV0Garden } from '../hooks/concepts';
import { asUrl, createSolidDataset, getDatetime, getSolidDataset, getThingAll, setDatetime, setThing } from '@inrupt/solid-client';
import { conceptIdFromUri } from '../model/concept';
import { urlSafeIdToConceptName } from '../utils/uris';
import { isBookmarkedFile, isBookmarkedImage, isBookmarkedLink, isConcept } from '../utils/rdf';
import { useState } from 'react';
import { waitUntilSymbol } from 'next/dist/server/web/spec-extension/fetch-event';

export default function MigrateV0Data() {
  const loggedIn = useLoggedIn();
  const webId = useWebId();

  const slug = HomeSpaceSlug
  const { space } = useSpace(webId, slug)
  const url = space && getNurseryFile(space)
  const { garden, setGarden } = useGarden(url, webId);

  const { garden: v0Garden } = useV0Garden(webId);

  const [migrating, setMigrating] = useState(false);
  const [complete, setComplete] = useState(false);
  const [logLines, setLogLines] = useState([]);
  function log(s) {
    console.log(s)
    setLogLines([...logLines, s]);
  }

  async function createNewItem({
    title,
    description,
    coverImage,
    url,
    file,
    noteValue,
    lastEdit
  }) {
    let newItem = createItem(webId, { title, description })
    setDatetime(newItem, DCTERMS.modified, lastEdit);
    if (coverImage) {
      newItem = setDepiction(newItem, coverImage)
      newItem = setImage(newItem, coverImage)
    }
    if (url) {
      newItem = setBookmark(newItem, url)
    }
    if (file) {
      newItem = setFile(newItem, file)
    }
    if (noteValue) {
      newItem = setTags(newItem, getTagsInNote(noteValue))
      newItem = setReferences(newItem, getReferencesInNote(noteValue))
    }
    newItem = setNote(newItem, await createNoteInSpace(space, noteValue || EmptySlateJSON, { fetch }))
  }

  async function onClick() {
    setMigrating(true);
    if (v0Garden) {
    log('Starting Migration');
    let newGarden = createSolidDataset()
    log('Creating New Garden');
      for (const old of v0Garden) {
        console.log(old)
        if (isConcept(old)) {
          const oldUri = asUrl(old);
          const id = conceptIdFromUri(oldUri);
          const name = urlSafeIdToConceptName(id);
          const notePath = notePath(webId, workspaceSlug, name);
          const lastEdit = getDatetime(old, DCTERMS.modified);
          const coverImage = getUrl(old, FOAF.img);
          log(`Migrating Note ${title}`);
          log(`Loading Note at ${notePath}`);
          const note = await getSolidDataset(oldNotePath);
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
          // TODO
          log(`Saving New Image at ${newUrl}`);
          const newItem = await createNewItem({
            title,
            lastEdit,
            coverImage: newUrl,
          });
          newGarden = setThing(newGarden, newItem);
          log(`Added Image to Garden ${title}`);
        } else if (isBookmarkedFile(old)) {
          const url = asUrl(old);
          const title = getStringNoLocale(old, DCTERMS.title);
          const lastEdit = getDatetime(old, DCTERMS.modified);
          const description = getStringNoLocale(old, DCTERMS.description);
          log(`Loading File at ${url}`);
          // TODO
          log(`Saving New File at ${newUrl}`);
          const newItem = await createNewItem({
            title,
            lastEdit,
            description,
            file: newUrl,
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
    } else {
      log('Old Garden not yet loaded, please wait.');
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(1000)
    }
    setMigrating(false);
  }

  return (
    <div className="page" id="page">
      {loggedIn === true ? (
        <>
          <Header />
          <div className="text-center pt-12 flex flex-col items-center">
            <h3 className="text-xl pb-6">
              Time to migrate your data! Press the button below to get started.{' '}
            </h3>
            {complete || migrating ? (
              logLines.map((line) => {
                <p className="text-l pb-6">{line}</p>;
              })
            ) : (
              <button
                className="btn-filled btn-md btn-square font-bold"
                onClick={onClick}
              >
                Migrate your v0 Data
              </button>
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
