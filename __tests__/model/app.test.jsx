/**
 * @jest-environment jsdom
 */
import { getUrl, removeUrl } from '@inrupt/solid-client/thing/get';

import { US, MY } from '../../vocab';
import { ensureWorkspace } from '../../model/app';

describe('ensureWorkspace', () => {
  const original = ensureWorkspace(
    undefined,
    'https://example/concept/prefix/',
    'https://example/tag/prefix/',
    'https://example/'
  );

  const ensured = ensureWorkspace(
    original,
    'https://should-not-use.example/',
    'https://should-not-use.example/',
    'https://should-not-use.example/'
  );

  const ensuredWithRemoval = ensureWorkspace(
    removeUrl(
      original,
      MY.News.publicationManifest,
      getUrl(original, MY.News.publicationManifest)
    ),
    'https://should-not-use.example/',
    'https://should-not-use.example/',
    'https://example2/'
  );

  it('creates a new workspace if the workspace does not exist', () => {
    expect(getUrl(original, US.conceptPrefix)).toBe(
      'https://example/concept/prefix/'
    );
    expect(getUrl(original, US.tagPrefix)).toBe('https://example/tag/prefix/');
    expect(getUrl(original, US.conceptIndex)).toBe(
      'https://example/concepts.ttl'
    );
    expect(getUrl(original, US.noteStorage)).toBe('https://example/notes/');
    expect(getUrl(original, US.backupsStorage)).toBe(
      'https://example/backups/'
    );
    expect(getUrl(original, MY.News.publicationManifest)).toBe(
      'https://example/publications.ttl'
    );
  });
  it('does not overwrite existing values', () => {
    expect(ensured).toEqual(original);
  });
  it('overwrites values not present', () => {
    expect(getUrl(ensuredWithRemoval, US.conceptIndex)).toBe(
      'https://example/concepts.ttl'
    );
    expect(getUrl(ensuredWithRemoval, MY.News.publicationManifest)).toBe(
      'https://example2/publications.ttl'
    );
  });
});