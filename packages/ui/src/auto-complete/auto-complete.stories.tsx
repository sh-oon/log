import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AutoComplete } from './auto-complete';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'lemon', label: 'Lemon' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'peach', label: 'Peach' },
  { value: 'pear', label: 'Pear' },
  { value: 'strawberry', label: 'Strawberry' },
];

const meta = {
  title: 'Form/AutoComplete',
  component: AutoComplete,
  tags: ['autodocs'],
} satisfies Meta<typeof AutoComplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: fruitOptions,
    placeholder: 'Search fruits...',
  },
};

export const WithDefaultValue: Story = {
  args: {
    options: fruitOptions,
    defaultValue: 'mango',
    placeholder: 'Search fruits...',
  },
};

export const Controlled: Story = {
  args: {
    options: fruitOptions,
    placeholder: 'Search fruits...',
  },
  render: (args) => {
    const [value, setValue] = useState('cherry');

    return (
      <div className="flex flex-col gap-4">
        <AutoComplete
          {...args}
          value={value}
          onValueChange={setValue}
        />
        <p className="text-sm-regular text-muted-foreground">
          Selected value: <strong className="text-foreground">{value || '(none)'}</strong>
        </p>
      </div>
    );
  },
};

export const CustomFilter: Story = {
  args: {
    options: fruitOptions,
    placeholder: 'Type to search (starts with)...',
    filterFn: (option, inputValue) =>
      option.label.toLowerCase().startsWith(inputValue.toLowerCase()),
  },
};

export const EmptyState: Story = {
  args: {
    options: [
      { value: 'alpha', label: 'Alpha' },
      { value: 'beta', label: 'Beta' },
    ],
    placeholder: 'Try typing "xyz"...',
    emptyMessage: 'No matching results',
  },
};

export const FloatingLabel: Story = {
  args: {
    options: fruitOptions,
    floatingLabel: 'Search fruits',
  },
};

export const FloatingLabelWithValue: Story = {
  args: {
    options: fruitOptions,
    defaultValue: 'mango',
    floatingLabel: 'Search fruits',
  },
};
