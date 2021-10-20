import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript"

const VercelEnv = process.env.VERCEL_ENV || ''

export function isPreviewEnv() {
  console.log(VercelEnv);
  return VercelEnv !== 'production';
}