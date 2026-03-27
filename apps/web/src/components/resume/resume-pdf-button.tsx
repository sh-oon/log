'use client';

import { useState } from 'react';
import { Button, Icon } from '@sunghoon-log/ui';
import type { Project } from '@/data/projects';
import type { ResumeData } from '@/types/resume';

interface ResumePdfButtonProps {
  resume: ResumeData | null;
  projects: Project[];
}

export const ResumePdfButton = ({
  resume,
  projects,
}: ResumePdfButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!resume) return;

    setIsGenerating(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { ResumePdfDocument } = await import('./resume-pdf-document');

      const blob = await pdf(
        <ResumePdfDocument
          resume={resume}
          projects={projects}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.intro.name || 'resume'}_이력서.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      const { toast } = await import('@sunghoon-log/ui');
      toast.error('PDF 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleDownload}
      disabled={!resume || isGenerating}
    >
      <Icon
        name="download"
        size={16}
      />
      {isGenerating ? 'Generating...' : 'PDF Download'}
    </Button>
  );
};
