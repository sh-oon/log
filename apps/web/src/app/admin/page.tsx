'use client';

import { useState } from 'react';
import { Button, Flex, Icon, Text, ToastProvider } from '@orka-log/ui';
import { signIn, useSession } from 'next-auth/react';
import { PostManager } from '@/components/admin/post-manager';
import { ProjectManager } from '@/components/admin/project-manager';
import { ResumeManager } from '@/components/admin/resume-manager';

const isDev = process.env.NODE_ENV === 'development';

type Tab = 'posts' | 'resume' | 'projects';

const AdminPage = () => {
  const { data: session, status } = useSession();
  const isAuthed = isDev || !!session;
  const [activeTab, setActiveTab] = useState<Tab>('posts');

  if (!isDev && status === 'loading') {
    return (
      <main className="max-w-md mx-auto px-6 py-32 text-center">
        <Text
          typography="text-sm-regular"
          color="muted"
        >
          Loading...
        </Text>
      </main>
    );
  }

  if (!isAuthed) {
    return (
      <main className="max-w-md mx-auto px-6 py-32">
        <ToastProvider />
        <div className="text-center mb-8">
          <Icon
            name="lock"
            size={48}
            className="mx-auto mb-4 text-muted-foreground"
          />
          <Text
            as="h1"
            typography="title-md-bold"
            className="mb-2"
          >
            Admin Login
          </Text>
          <Text
            typography="text-sm-regular"
            color="muted"
          >
            블로그 관리를 위해 GitHub으로 로그인하세요.
          </Text>
        </div>
        <Button
          onClick={() => signIn('github')}
          className="w-full"
        >
          <Icon
            name="github"
            size={16}
          />
          Sign in with GitHub
        </Button>
      </main>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'posts', label: 'Posts' },
    { key: 'resume', label: 'Resume' },
    { key: 'projects', label: 'Projects' },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <ToastProvider />
      <Text
        as="h1"
        typography="title-lg-bold"
        className="mb-8"
      >
        Admin
      </Text>

      <Flex
        gap={1}
        className="mb-8 border-b border-border"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </Flex>

      {activeTab === 'posts' && <PostManager />}
      {activeTab === 'resume' && <ResumeManager />}
      {activeTab === 'projects' && <ProjectManager />}
    </main>
  );
};

export default AdminPage;
