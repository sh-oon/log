import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { EmptyState } from './empty-state';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function InboxIcon() {
  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx={11}
        cy={11}
        r={8}
      />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    icon: <InboxIcon />,
    title: 'No messages yet',
    description: 'When you receive messages, they will appear here.',
  },
};

// ---------------------------------------------------------------------------
// WithAction
// ---------------------------------------------------------------------------

export const WithAction: Story = {
  args: {
    icon: <InboxIcon />,
    title: 'No projects found',
    description: 'Get started by creating your first project.',
    action: <Button size="sm">Create Project</Button>,
  },
};

// ---------------------------------------------------------------------------
// Minimal
// ---------------------------------------------------------------------------

export const Minimal: Story = {
  args: {
    title: 'Nothing here',
  },
};

// ---------------------------------------------------------------------------
// SearchNoResults
// ---------------------------------------------------------------------------

export const SearchNoResults: Story = {
  args: {
    icon: <SearchIcon />,
    title: 'No results found',
    description: 'Try adjusting your search terms or filters to find what you are looking for.',
  },
};
