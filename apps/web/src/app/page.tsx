import { ResumeView } from '@/components/resume/resume-view';

export const dynamic = 'force-dynamic';

/**
 * Home route — renders the resume page (intro, experience, projects, skills).
 *
 * @example
 * // app router auto-mounts this at "/"
 * export default function Home() { ... }
 */
export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8">
      <ResumeView />
    </main>
  );
}
