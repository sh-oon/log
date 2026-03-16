import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { auth } from '@/lib/auth';

const isDev = process.env.NODE_ENV === 'development';
const UPLOAD_DIR = path.join(process.cwd(), 'public/images/posts');

export const POST = async (request: Request) => {
  const session = isDev || (await auth());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Image upload is only available in development mode' },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() ?? 'png';
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .toLowerCase();
  const fileName = `${timestamp}-${safeName}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, fileName), buffer);

  const url = `/images/posts/${fileName}`;
  return NextResponse.json({ url }, { status: 201 });
};
