-- Update homework bucket to be public so getPublicUrl works
UPDATE storage.buckets
SET public = true
WHERE id = 'homework';

-- Drop the old complex policies
DROP POLICY IF EXISTS "Users can upload their own homework files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own homework files" ON storage.objects;
DROP POLICY IF EXISTS "Admins and trainers can view homework files" ON storage.objects;

-- Create simpler policies
CREATE POLICY "Authenticated users can upload homework"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'homework');

CREATE POLICY "Public can view homework files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'homework');

-- Also allow authenticated users to UPDATE/DELETE their own files if needed
CREATE POLICY "Users can update their own homework"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'homework' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own homework"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'homework' AND (auth.uid())::text = (storage.foldername(name))[1]);

NOTIFY pgrst, 'reload schema';
