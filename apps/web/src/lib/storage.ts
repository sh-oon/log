import { supabaseAdmin } from './supabase';

const BUCKET = 'posts';

const generateFilePath = (file: File): string => {
  const timestamp = Date.now();
  const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${timestamp}-${sanitized}`;
};

export const uploadImage = async (file: File): Promise<string> => {
  const client = supabaseAdmin.get();
  const filePath = generateFilePath(file);

  const { error } = await client.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = client.storage.from(BUCKET).getPublicUrl(filePath);

  return publicUrl;
};

export const deleteImage = async (filePath: string): Promise<void> => {
  const client = supabaseAdmin.get();

  const { error } = await client.storage.from(BUCKET).remove([filePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};
