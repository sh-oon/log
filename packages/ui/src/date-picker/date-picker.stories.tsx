import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../text';
import { DatePicker } from './date-picker';

const meta = {
  title: 'Form/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: new Date(2025, 5, 15),
  },
};

export const WithMinMax: Story = {
  args: {
    defaultValue: new Date(),
    min: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    max: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: new Date(),
  },
};

export const Controlled: Story = {
  args: {},
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col gap-4">
        <DatePicker
          value={date}
          onValueChange={setDate}
          placeholder="Pick a date"
        />
        <Text
          as="p"
          typography="text-sm-regular"
          color="muted"
        >
          {date ? `Selected: ${date.toLocaleDateString('ko-KR')}` : 'No date selected'}
        </Text>
      </div>
    );
  },
};
