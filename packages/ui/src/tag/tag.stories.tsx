import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './tag';

const meta = {
  title: 'Data Display/Tag',
  component: Tag,
  tags: ['autodocs'],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default',
  },
};

export const Success: Story = {
  args: {
    children: 'Active',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Pending',
    variant: 'warning',
  },
};

export const ErrorVariant: Story = {
  args: {
    children: 'Failed',
    variant: 'error',
  },
};

export const Info: Story = {
  args: {
    children: 'New',
    variant: 'info',
  },
};

export const Variants: Story = {
  args: { children: 'Tag' },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag variant="default">Default</Tag>
      <Tag variant="success">Active</Tag>
      <Tag variant="warning">Pending</Tag>
      <Tag variant="error">Failed</Tag>
      <Tag variant="info">New</Tag>
    </div>
  ),
};

export const Sizes: Story = {
  args: { children: 'Tag' },
  render: () => (
    <div className="flex items-center gap-2">
      <Tag
        size="sm"
        variant="info"
      >
        Small
      </Tag>
      <Tag
        size="md"
        variant="info"
      >
        Medium
      </Tag>
    </div>
  ),
};

export const InContext: Story = {
  args: { children: 'Tag' },
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <article className="rounded-xl border border-border bg-background p-4 shadow-soft-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm-semibold text-foreground">Payment Processing</span>
          <Tag variant="success">Active</Tag>
        </div>
        <p className="text-xs-regular text-muted-foreground mt-1">
          All payment services are operating normally.
        </p>
      </article>
      <article className="rounded-xl border border-border bg-background p-4 shadow-soft-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm-semibold text-foreground">Data Sync</span>
          <Tag variant="warning">Pending</Tag>
        </div>
        <p className="text-xs-regular text-muted-foreground mt-1">
          Synchronization is queued and will start shortly.
        </p>
      </article>
      <article className="rounded-xl border border-border bg-background p-4 shadow-soft-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm-semibold text-foreground">Email Service</span>
          <Tag variant="error">Failed</Tag>
        </div>
        <p className="text-xs-regular text-muted-foreground mt-1">
          Email delivery encountered an error. Retrying...
        </p>
      </article>
    </div>
  ),
};
