import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Text } from '../text';
import { Tooltip } from './tooltip';

const meta = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Tooltip text',
    side: 'top',
    delay: 300,
    children: (<span />) as React.ReactElement,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center justify-center p-20">
      <Tooltip {...args}>
        <span className="cursor-default underline decoration-dashed underline-offset-4">
          <Text
            as="span"
            typography="text-sm-regular"
            color="foreground"
          >
            Hover me
          </Text>
        </span>
      </Tooltip>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Sides
// ---------------------------------------------------------------------------

export const Sides: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8 p-20">
      <Tooltip
        content="Top tooltip"
        side="top"
      >
        <span className="cursor-default underline decoration-dashed underline-offset-4">
          <Text
            as="span"
            typography="text-sm-regular"
            color="foreground"
          >
            Top
          </Text>
        </span>
      </Tooltip>
      <Tooltip
        content="Bottom tooltip"
        side="bottom"
      >
        <span className="cursor-default underline decoration-dashed underline-offset-4">
          <Text
            as="span"
            typography="text-sm-regular"
            color="foreground"
          >
            Bottom
          </Text>
        </span>
      </Tooltip>
      <Tooltip
        content="Left tooltip"
        side="left"
      >
        <span className="cursor-default underline decoration-dashed underline-offset-4">
          <Text
            as="span"
            typography="text-sm-regular"
            color="foreground"
          >
            Left
          </Text>
        </span>
      </Tooltip>
      <Tooltip
        content="Right tooltip"
        side="right"
      >
        <span className="cursor-default underline decoration-dashed underline-offset-4">
          <Text
            as="span"
            typography="text-sm-regular"
            color="foreground"
          >
            Right
          </Text>
        </span>
      </Tooltip>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// WithDelay
// ---------------------------------------------------------------------------

export const WithDelay: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8 p-20">
      <Tooltip
        content="Instant (0ms)"
        delay={0}
      >
        <span className="cursor-default underline decoration-dashed underline-offset-4">
          <Text
            as="span"
            typography="text-sm-regular"
            color="foreground"
          >
            No delay
          </Text>
        </span>
      </Tooltip>
      <Tooltip
        content="Short (150ms)"
        delay={150}
      >
        <span className="cursor-default underline decoration-dashed underline-offset-4">
          <Text
            as="span"
            typography="text-sm-regular"
            color="foreground"
          >
            150ms
          </Text>
        </span>
      </Tooltip>
      <Tooltip
        content="Default (300ms)"
        delay={300}
      >
        <span className="cursor-default underline decoration-dashed underline-offset-4">
          <Text
            as="span"
            typography="text-sm-regular"
            color="foreground"
          >
            300ms
          </Text>
        </span>
      </Tooltip>
      <Tooltip
        content="Long (800ms)"
        delay={800}
      >
        <span className="cursor-default underline decoration-dashed underline-offset-4">
          <Text
            as="span"
            typography="text-sm-regular"
            color="foreground"
          >
            800ms
          </Text>
        </span>
      </Tooltip>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// OnButton
// ---------------------------------------------------------------------------

export const OnButton: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-4 p-20">
      <Tooltip
        content="Save your changes"
        side="top"
      >
        <Button size="sm">Save</Button>
      </Tooltip>
      <Tooltip
        content="Discard all changes"
        side="bottom"
      >
        <Button
          variant="outline"
          size="sm"
        >
          Cancel
        </Button>
      </Tooltip>
      <Tooltip
        content="This action is irreversible"
        side="right"
      >
        <Button
          variant="destructive"
          size="sm"
        >
          Delete
        </Button>
      </Tooltip>
    </div>
  ),
};
