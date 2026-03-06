import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs-medium text-muted-foreground">Text (default)</p>
        <Skeleton variant="text" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs-medium text-muted-foreground">Circular</p>
        <Skeleton
          variant="circular"
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs-medium text-muted-foreground">Rectangular</p>
        <Skeleton
          variant="rectangular"
          width={240}
          height={120}
        />
      </div>
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4 rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center gap-3">
        <Skeleton
          variant="circular"
          width={40}
          height={40}
        />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton
            variant="text"
            width="60%"
          />
          <Skeleton
            variant="text"
            width="40%"
            height={12}
          />
        </div>
      </div>
      <Skeleton
        variant="rectangular"
        height={160}
      />
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" />
        <Skeleton
          variant="text"
          width="80%"
        />
      </div>
    </div>
  ),
};

export const TextBlock: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton
        variant="text"
        width="65%"
      />
    </div>
  ),
};
