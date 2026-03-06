import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Sizes: Story = {
  args: { value: 60 },
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs-medium text-muted-foreground">Small</p>
        <Progress
          value={60}
          size="sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs-medium text-muted-foreground">Medium (default)</p>
        <Progress
          value={60}
          size="md"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs-medium text-muted-foreground">Large</p>
        <Progress
          value={60}
          size="lg"
        />
      </div>
    </div>
  ),
};

export const Colors: Story = {
  args: { value: 70 },
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs-medium text-muted-foreground">Primary</p>
        <Progress
          value={70}
          color="primary"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs-medium text-muted-foreground">Success</p>
        <Progress
          value={70}
          color="success"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs-medium text-muted-foreground">Warning</p>
        <Progress
          value={70}
          color="warning"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs-medium text-muted-foreground">Error</p>
        <Progress
          value={70}
          color="error"
        />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    value: 75,
    showLabel: true,
  },
};

export const Animated: Story = {
  args: { value: 0 },
  render: () => {
    const [value, setValue] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setValue((prev) => {
          if (prev >= 100) return 0;
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex w-96 flex-col gap-4">
        <Progress
          value={value}
          showLabel
          size="lg"
          color="primary"
        />
      </div>
    );
  },
};
