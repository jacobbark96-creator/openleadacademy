-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for storage.objects
-- Allow public read access to all buckets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);

-- Allow authenticated users (admins/trainers) to upload to thumbnails, resources, and avatars
CREATE POLICY "Admin/Trainer Upload" ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id IN ('thumbnails', 'resources', 'avatars') AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'trainer')
  )
);

CREATE POLICY "Admin/Trainer Update" ON storage.objects FOR UPDATE
USING (
  bucket_id IN ('thumbnails', 'resources', 'avatars') AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'trainer')
  )
);

CREATE POLICY "Admin/Trainer Delete" ON storage.objects FOR DELETE
USING (
  bucket_id IN ('thumbnails', 'resources', 'avatars') AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'trainer')
  )
);
