-- =========================================================================
-- SAFARAI - STORAGE BUCKET MIGRATION
-- =========================================================================
-- This script creates a new public bucket called "community_images"
-- and configures row-level security so that users can only upload
-- files into a folder matching their exact User ID.
-- =========================================================================

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('community_images', 'community_images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up RLS Policies for the storage.objects table

-- Allow public read access to the bucket
CREATE POLICY "Anyone can view community images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'community_images');

-- Allow authenticated users to upload files ONLY to their personal folder
CREATE POLICY "Users can upload to their own folder" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'community_images' 
  AND auth.role() = 'authenticated'
  -- Enforce that the first part of the folder path matches their auth.uid()
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update their own folder"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'community_images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete from their own folder"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'community_images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
