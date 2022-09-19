const VercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || '';

export const IsPreviewEnv = VercelEnv !== 'production';

export const ImportHtmlNoteBody = false

export const DefaultPodDomain = process.env.NEXT_PUBLIC_DEFAULT_POD_DOMAIN || 'mysilio.me'