const VercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || '';

export const IsPreviewEnv = VercelEnv !== 'production';
// NOTE: We prepent the username to this, so no https://
export const DefaultPodDomain = 'v0.mysilio.me';
export const ImportHtmlNoteBody = false
