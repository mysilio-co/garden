const VercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || '';

export const IsPreviewEnv = VercelEnv !== 'production';

export const ImportHtmlNoteBody = false
