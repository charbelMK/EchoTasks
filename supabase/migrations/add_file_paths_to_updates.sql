-- Add file_paths column to updates table for multiple attachments
ALTER TABLE updates ADD COLUMN file_paths text[];

-- Optional: Migrate existing file_path to file_paths if needed, but we will support both for backward compatibility in UI
-- UPDATE updates SET file_paths = ARRAY[file_path] WHERE file_path IS NOT NULL;
