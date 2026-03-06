import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Text } from '../text';
import { Spinner } from './spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <Text
          as="span"
          typography="text-xs-regular"
          color="muted"
        >
          Small
        </Text>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <Text
          as="span"
          typography="text-xs-regular"
          color="muted"
        >
          Medium
        </Text>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <Text
          as="span"
          typography="text-xs-regular"
          color="muted"
        >
          Large
        </Text>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner color="primary" />
        <Text
          as="span"
          typography="text-xs-regular"
          color="muted"
        >
          Primary
        </Text>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner color="muted" />
        <Text
          as="span"
          typography="text-xs-regular"
          color="muted"
        >
          Muted
        </Text>
      </div>
      <div className="flex flex-col items-center gap-2 text-red-500">
        <Spinner color="inherit" />
        <Text
          as="span"
          typography="text-xs-regular"
          color="muted"
        >
          Inherit (red)
        </Text>
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner size="sm" />
      <Text
        as="span"
        typography="text-sm-regular"
        color="muted"
      >
        Loading...
      </Text>
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled>
        <Spinner
          size="sm"
          color="inherit"
        />
        <Text
          as="span"
          typography="text-sm-regular"
          color="inherit"
        >
          Loading...
        </Text>
      </Button>
      <Button
        variant="outline"
        disabled
      >
        <Spinner
          size="sm"
          color="inherit"
        />
        <Text
          as="span"
          typography="text-sm-regular"
          color="inherit"
        >
          Saving
        </Text>
      </Button>
    </div>
  ),
};
