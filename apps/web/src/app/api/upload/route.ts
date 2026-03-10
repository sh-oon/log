import { type NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/storage';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin1234';

const isAuthorized = (request: NextRequest): boolean => {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${ADMIN_PASSWORD}`;
};

export const POST = async (request: NextRequest) => {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 });
  }

  try {
    const publicUrl = await uploadImage(file);
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
