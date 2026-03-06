import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'Hello, World!\nThis is a multi-line textarea.',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled',
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: 'Invalid input',
    variant: 'error',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Textarea
        {...args}
        textareaSize="sm"
        placeholder="Small textarea"
      />
      <Textarea
        {...args}
        textareaSize="md"
        placeholder="Medium textarea"
      />
      <Textarea
        {...args}
        textareaSize="lg"
        placeholder="Large textarea"
      />
    </div>
  ),
};

export const WithMaxLength: Story = {
  args: {
    placeholder: 'Max 200 characters...',
    maxLength: 200,
    rows: 5,
  },
};

export const FloatingLabel: Story = {
  args: {
    floatingLabel: 'Description',
    floatingLabelId: 'textarea-floating',
  },
};

export const FloatingLabelWithValue: Story = {
  args: {
    floatingLabel: 'Description',
    floatingLabelId: 'textarea-floating-value',
    defaultValue:
      'Some long text that demonstrates the floated state of the label when the textarea already has content.',
  },
};

export const FloatingLabelSizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Textarea
        {...args}
        textareaSize="sm"
        floatingLabel="Small textarea"
        floatingLabelId="textarea-floating-sm"
      />
      <Textarea
        {...args}
        textareaSize="md"
        floatingLabel="Medium textarea"
        floatingLabelId="textarea-floating-md"
      />
      <Textarea
        {...args}
        textareaSize="lg"
        floatingLabel="Large textarea"
        floatingLabelId="textarea-floating-lg"
      />
    </div>
  ),
};
