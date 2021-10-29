import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript"

const VercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || '';

export function isPreviewEnv() {
  console.log(VercelEnv);
  return VercelEnv !== 'production';
}