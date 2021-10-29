import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript"

const VercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || '';

export function isPreviewEnv() {
  return VercelEnv !== 'production';
}