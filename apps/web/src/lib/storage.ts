import { del, list, put } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

// ─── JSON Storage ───

const readLocal = <T>(filePath: string): T => {
  const fullPath = path.join(process.cwd(), filePath);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(raw);
};

export const readJson = async <T>(filePath: string, blobPath: string): Promise<T> => {
  if (!useBlob) return readLocal<T>(filePath);

  const { blobs } = await list({ prefix: blobPath, limit: 1 });
  if (blobs.length === 0) {
    const data = readLocal<T>(filePath);
    await put(blobPath, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });
    return data;
  }

  const res = await fetch(blobs[0].url);
  return res.json();
};

export const writeJson = async <T>(filePath: string, blobPath: string, data: T): Promise<void> => {
  if (!useBlob) {
    const fullPath = path.join(process.cwd(), filePath);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
    return;
  }

  await put(blobPath, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
};

// ─── Image Storage ───

export const uploadImage = async (
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> => {
  if (!useBlob) {
    const uploadDir = path.join(process.cwd(), 'public/images/posts');
    fs.writeFileSync(path.join(uploadDir, fileName), buffer);
    return `/images/posts/${fileName}`;
  }

  const blob = await put(`images/posts/${fileName}`, buffer, {
    access: 'public',
    addRandomSuffix: false,
    contentType,
  });
  return blob.url;
};

export const deleteImage = async (url: string): Promise<void> => {
  if (!useBlob) return;
  await del(url);
};
