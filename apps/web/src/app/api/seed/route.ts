import { NextResponse } from 'next/server';
import postsData from '@/data/posts.json';
import projectsData from '@/data/projects.json';
import resumeData from '@/data/resume.json';
import { auth } from '@/lib/auth';
import { writeJson } from '@/lib/storage';

const isDev = process.env.NODE_ENV === 'development';

const SEED_TARGETS = {
  posts: () => writeJson('src/data/posts.json', 'data/posts.json', postsData),
  resume: () => writeJson('src/data/resume.json', 'data/resume.json', resumeData),
  projects: () => writeJson('src/data/projects.json', 'data/projects.json', projectsData),
} as const;

type SeedTarget = keyof typeof SEED_TARGETS;

const ALL_TARGETS = Object.keys(SEED_TARGETS) as SeedTarget[];

const isSeedTarget = (value: string): value is SeedTarget => value in SEED_TARGETS;

/**
 * Seeding replaces the whole blob copy, so re-seeding the resume would also roll
 * posts back to the bundled snapshot. `?target=` narrows that blast radius.
 *
 * @example
 * // resume and projects only — posts written from /admin stay untouched
 * fetch('/api/seed?target=resume,projects', { method: 'POST' });
 */
const parseTargets = (param: string | null): SeedTarget[] | null => {
  if (!param) return ALL_TARGETS;

  const requested = param
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const targets = [...new Set(requested.filter(isSeedTarget))];

  return requested.length > 0 && targets.length === requested.length ? targets : null;
};

export const POST = async (request: Request) => {
  const session = isDev || (await auth());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN is not set' }, { status: 500 });
  }

  const targets = parseTargets(new URL(request.url).searchParams.get('target'));
  if (!targets) {
    return NextResponse.json(
      { error: `target must be a comma-separated subset of: ${ALL_TARGETS.join(', ')}` },
      { status: 400 }
    );
  }

  await Promise.all(targets.map((target) => SEED_TARGETS[target]()));

  return NextResponse.json({
    success: true,
    seeded: targets,
    message: `Seeded ${targets.join(', ')} to Blob`,
  });
};
