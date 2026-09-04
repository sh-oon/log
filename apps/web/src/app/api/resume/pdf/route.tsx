import { renderToBuffer } from '@react-pdf/renderer';
import { ResumePdfDocument } from '@/components/resume/resume-pdf-document';
import { getProjects, getResume } from '@/lib/resume';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const buildContentDisposition = (name: string) => {
  const fileName = `${name || 'resume'}_이력서.pdf`;

  // Non-ASCII filenames are only carried by the RFC 5987 form; older clients get the plain fallback.
  return `attachment; filename="resume.pdf"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
};

export const GET = async () => {
  const [resume, projects] = await Promise.all([getResume(), getProjects()]);

  const buffer = await renderToBuffer(
    <ResumePdfDocument
      resume={resume}
      projects={projects}
    />
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': buildContentDisposition(resume.intro.name),
      'Cache-Control': 'no-store',
    },
  });
};
