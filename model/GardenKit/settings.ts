import { Profile, Slug } from './types';
import { getRootContainer } from './spaces';

export function appSettingsUrl(profile: Profile, namespace: Slug, name: Slug) {
  const base = profile && getRootContainer(profile);
  const path = `settings/${namespace}.ttl#${name}`;
  return profile && new URL(path, base).toString();
}
