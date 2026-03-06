import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../text';
import { Space } from './space';

const meta = {
  title: 'Layout/Space',
  component: Space,
  tags: ['autodocs'],
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <div key={size}>
          <Text
            as="span"
            typography="text-xs-medium"
            color="muted"
          >
            {size}
          </Text>
          <Space size={size} />
          <div className="h-px w-40 bg-border" />
        </div>
      ))}
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Horizontal
// ---------------------------------------------------------------------------

export const Horizontal: Story = {
  render: () => (
    <div className="flex h-8 items-center">
      <div className="h-full w-16 rounded-lg bg-muted" />
      <Space
        size="md"
        direction="horizontal"
      />
      <div className="h-full w-16 rounded-lg bg-muted" />
      <Space
        size="lg"
        direction="horizontal"
      />
      <div className="h-full w-16 rounded-lg bg-muted" />
      <Space
        size="xl"
        direction="horizontal"
      />
      <div className="h-full w-16 rounded-lg bg-muted" />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// BetweenContent
// ---------------------------------------------------------------------------

export const BetweenContent: Story = {
  render: () => (
    <div className="max-w-sm">
      <Text
        as="h3"
        typography="title-sm-semibold"
        color="foreground"
      >
        Section Title
      </Text>
      <Space size="sm" />
      <Text
        as="p"
        typography="text-sm-regular"
        color="muted"
      >
        This is the first paragraph of content. The Space component creates consistent vertical
        spacing between elements.
      </Text>
      <Space size="lg" />
      <Text
        as="h3"
        typography="title-sm-semibold"
        color="foreground"
      >
        Another Section
      </Text>
      <Space size="sm" />
      <Text
        as="p"
        typography="text-sm-regular"
        color="muted"
      >
        This section is separated from the previous one by a large space. Consistent spacing
        improves readability.
      </Text>
    </div>
  ),
};
