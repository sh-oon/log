import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Chip } from './chip';

const meta = {
  title: 'Action/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: {
    onSelect: fn(),
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Chip',
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected',
    selected: true,
  },
};

export const WithDismiss: Story = {
  args: {
    children: 'Dismissible',
    onDismiss: fn(),
  },
};

export const SelectedWithDismiss: Story = {
  args: {
    children: 'Selected',
    selected: true,
    onDismiss: fn(),
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const Sizes: Story = {
  args: { children: 'Chip' },
  render: () => (
    <div className="flex items-center gap-2">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
    </div>
  ),
};

export const ChipGroup: Story = {
  args: { children: 'Chip' },
  render: function ChipGroupStory() {
    const filters = ['All', 'Design', 'Engineering', 'Product', 'Marketing'];
    const [selected, setSelected] = useState<Set<string>>(new Set(['All']));

    const toggle = (filter: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(filter)) {
          next.delete(filter);
        } else {
          next.add(filter);
        }
        return next;
      });
    };

    return (
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <Chip
            key={filter}
            selected={selected.has(filter)}
            onSelect={() => toggle(filter)}
          >
            {filter}
          </Chip>
        ))}
      </div>
    );
  },
};
