import { NextResponse } from 'next/server';
import postsData from '@/data/posts.json';
import projectsData from '@/data/projects.json';
import resumeData from '@/data/resume.json';
import { auth } from '@/lib/auth';
import { writeJson } from '@/lib/storage';

const isDev = process.env.NODE_ENV === 'development';

export const POST = async () => {
  const session = isDev || (await auth());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN is not set' }, { status: 500 });
  }

  await Promise.all([
    writeJson('src/data/posts.json', 'data/posts.json', postsData),
    writeJson('src/data/resume.json', 'data/resume.json', resumeData),
    writeJson('src/data/projects.json', 'data/projects.json', projectsData),
  ]);

  return NextResponse.json({
    success: true,
    message: 'Seeded posts, resume, and projects to Blob',
  });
};
