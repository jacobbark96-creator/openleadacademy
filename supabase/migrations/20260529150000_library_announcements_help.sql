-- Update modules table
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Update resources table to act as a "Library"
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS category TEXT; -- e.g. 'PDF', 'Link', 'Document'

-- Update announcements table
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create help_articles table
CREATE TABLE IF NOT EXISTS public.help_articles (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g. 'Getting Started', 'Account', 'Courses'
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on help_articles
ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;

-- Add policies for Admin/Trainer to manage resources, announcements, and help articles
DO $$ 
BEGIN
    -- Resources policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage resources' AND tablename = 'resources') THEN
        CREATE POLICY "Admins can manage resources" ON public.resources
        FOR ALL USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students can view resources' AND tablename = 'resources') THEN
        CREATE POLICY "Students can view resources" ON public.resources
        FOR SELECT USING (true);
    END IF;

    -- Announcements policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage announcements' AND tablename = 'announcements') THEN
        CREATE POLICY "Admins can manage announcements" ON public.announcements
        FOR ALL USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students can view announcements' AND tablename = 'announcements') THEN
        CREATE POLICY "Students can view announcements" ON public.announcements
        FOR SELECT USING (true);
    END IF;

    -- Help Articles policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage help articles' AND tablename = 'help_articles') THEN
        CREATE POLICY "Admins can manage help articles" ON public.help_articles
        FOR ALL USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Everyone can view help articles' AND tablename = 'help_articles') THEN
        CREATE POLICY "Everyone can view help articles" ON public.help_articles
        FOR SELECT USING (true);
    END IF;
END $$;
