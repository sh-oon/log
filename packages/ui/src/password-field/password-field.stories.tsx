import type { Meta, StoryObj } from '@storybook/react';
import { PasswordField } from './password-field';

const meta = {
  title: 'Form/PasswordField',
  component: PasswordField,
  tags: ['autodocs'],
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
  },
};

export const FloatingLabel: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    helperText: 'Must be at least 8 characters',
    placeholder: 'Enter password',
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    errorMessage: 'Password is too short',
    placeholder: 'Enter password',
  },
};

export const Required: Story = {
  args: {
    label: 'Password',
    required: true,
    placeholder: 'Enter password',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Password',
    disabled: true,
    defaultValue: 'password123',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PasswordField
        label="Small"
        inputSize="sm"
        placeholder="Enter password"
      />
      <PasswordField
        label="Medium"
        inputSize="md"
        placeholder="Enter password"
      />
      <PasswordField
        label="Large"
        inputSize="lg"
        placeholder="Enter password"
      />
    </div>
  ),
};
