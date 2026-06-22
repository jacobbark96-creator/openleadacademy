-- Add audio uploads for lesson content and remove the unused profile YouTube field.
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS audio_url text;

ALTER TABLE public.profiles
DROP COLUMN IF EXISTS youtube_url;
