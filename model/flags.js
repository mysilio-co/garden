import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript"

const VercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || '';

export const IsPreviewEnv = VercelEnv !== 'production';
export const DefaultPodDomain = IsPreviewEnv
  ? 'staging.mysilio.me'
  : 'mysilio.me';