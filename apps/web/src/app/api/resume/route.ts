import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getResume, updateResume } from '@/lib/resume';
import type { ResumeData } from '@/types/resume';

const isDev = process.env.NODE_ENV === 'development';

export const GET = async () => {
  const resume = await getResume();
  return NextResponse.json(resume);
};

export const PUT = async (request: Request) => {
  const session = isDev || (await auth());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: ResumeData = await request.json();
    const updated = await updateResume(body);
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
