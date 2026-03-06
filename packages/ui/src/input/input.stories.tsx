import type { Meta, StoryObj } from '@storybook/react';
import { SearchIcon, XIcon } from '../icons';
import { Input } from './input';

const meta = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: 'Invalid input',
    variant: 'error',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small input',
    inputSize: 'sm',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large input',
    inputSize: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled',
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'Hello, World!',
  },
};

export const FloatingLabel: Story = {
  args: {
    floatingLabel: 'Email',
    floatingLabelId: 'floating-email',
  },
};

export const FloatingLabelWithValue: Story = {
  args: {
    floatingLabel: 'Name',
    floatingLabelId: 'floating-name',
    defaultValue: '홍길동',
  },
};

export const FloatingLabelSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input
        inputSize="sm"
        floatingLabel="Small"
        floatingLabelId="floating-sm"
      />
      <Input
        inputSize="md"
        floatingLabel="Medium"
        floatingLabelId="floating-md"
      />
      <Input
        inputSize="lg"
        floatingLabel="Large"
        floatingLabelId="floating-lg"
      />
    </div>
  ),
};

export const FloatingLabelWithAdornment: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input
        floatingLabel="Search"
        floatingLabelId="floating-search"
        startAdornment={<SearchIcon size={18} />}
      />
      <Input
        floatingLabel="Query"
        floatingLabelId="floating-query"
        startAdornment={<SearchIcon size={18} />}
        endAdornment={
          <button
            type="button"
            aria-label="Clear input"
          >
            <XIcon size={18} />
          </button>
        }
      />
    </div>
  ),
};
