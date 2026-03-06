import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from './flex';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gray-200 text-gray-900 px-4 py-2 text-sm font-medium">{children}</div>
);

const meta = {
  title: 'Layout/Flex',
  component: Flex,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
      </>
    ),
  },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = {
  args: {
    direction: 'row',
    gap: 4,
  },
};

export const Column: Story = {
  args: {
    direction: 'column',
    gap: 4,
  },
};

export const Centered: Story = {
  args: {
    align: 'center',
    justify: 'center',
    gap: 4,
    className: 'h-48 border border-dashed border-gray-300',
  },
};

export const SpaceBetween: Story = {
  args: {
    justify: 'between',
    align: 'center',
    className: 'w-full',
  },
};

export const Wrap: Story = {
  args: {
    wrap: 'wrap',
    gap: 4,
    className: 'max-w-xs',
    children: (
      <>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
        <Box>Item 4</Box>
        <Box>Item 5</Box>
        <Box>Item 6</Box>
      </>
    ),
  },
};

export const WithGap: Story = {
  args: {
    gap: 8,
  },
};
