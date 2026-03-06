import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './divider';

const meta = {
  title: 'Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  decorators: [
    (Story) => (
      <div className="flex h-20 items-center">
        <Story />
      </div>
    ),
  ],
};

export const InContent: Story = {
  args: { orientation: 'horizontal' },
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm-regular text-foreground">
        This is the first section of content. It contains some text that appears above the divider.
      </p>
      <Divider />
      <p className="text-sm-regular text-foreground">
        This is the second section of content. It appears below the divider, visually separated from
        the first section.
      </p>
      <Divider />
      <p className="text-sm-regular text-foreground">
        And here is one more section, also separated by a divider.
      </p>
    </div>
  ),
};
