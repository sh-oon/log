import type { Meta, StoryObj } from '@storybook/react';
import { SearchIcon } from '../icons';
import { TextField } from './text-field';

const meta = {
  title: 'Form/TextField',
  component: TextField,
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },
};

export const FloatingLabel: Story = {
  args: {
    label: 'Email address',
    placeholder: 'Enter your email',
  },
};

export const FloatingLabelWithValue: Story = {
  args: {
    label: 'Email address',
    defaultValue: 'john@example.com',
  },
};

export const FloatingLabelError: Story = {
  args: {
    label: 'Email address',
    errorMessage: 'Invalid email address',
    defaultValue: 'invalid',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    helperText: 'Must be at least 3 characters',
    placeholder: 'Enter username',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    errorMessage: 'Invalid email address',
    placeholder: 'Enter email',
    defaultValue: 'invalid',
  },
};

export const WithStartIcon: Story = {
  args: {
    label: 'Search',
    startIcon: <SearchIcon size={16} />,
    placeholder: 'Search...',
  },
};

export const Clearable: Story = {
  args: {
    label: 'Name',
    clearable: true,
    defaultValue: 'John Doe',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    required: true,
    placeholder: 'Enter email',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    disabled: true,
    defaultValue: 'disabled@example.com',
  },
};

export const Search: Story = {
  args: {
    startIcon: <SearchIcon size={16} />,
    clearable: true,
    placeholder: 'Search...',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TextField
        label="Small"
        inputSize="sm"
        placeholder="Small input"
      />
      <TextField
        label="Medium"
        inputSize="md"
        placeholder="Medium input"
      />
      <TextField
        label="Large"
        inputSize="lg"
        placeholder="Large input"
      />
    </div>
  ),
};
