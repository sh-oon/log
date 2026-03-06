import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Switch } from './switch';

const meta = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Airplane mode',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Dark mode',
    description: 'Toggle between light and dark themes.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    label: 'Disabled (checked)',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Switch
        {...args}
        size="sm"
        label="Small"
      />
      <Switch
        {...args}
        size="md"
        label="Medium"
      />
      <Switch
        {...args}
        size="lg"
        label="Large"
      />
    </div>
  ),
};
