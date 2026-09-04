'use client';

import { useState } from 'react';
import { Button, Icon } from '@orka-log/ui';

interface ResumePdfButtonProps {
  fileName?: string;
}

export const ResumePdfButton = ({ fileName = 'resume.pdf' }: ResumePdfButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/resume/pdf');
      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      const { toast } = await import('@orka-log/ui');
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
      disabled={isGenerating}
    >
      <Icon
        name="download"
        size={16}
      />
      {isGenerating ? 'Generating...' : 'PDF Download'}
    </Button>
  );
};
