import { NextResponse } from 'next/server';
import type { Project } from '@/data/projects';
import { auth } from '@/lib/auth';
import { getProjects, updateProjects } from '@/lib/resume';

const isDev = process.env.NODE_ENV === 'development';

export const GET = async () => {
  const projects = await getProjects();
  return NextResponse.json(projects);
};

export const PUT = async (request: Request) => {
  const session = isDev || (await auth());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: Project[] = await request.json();
    const updated = await updateProjects(body);
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
