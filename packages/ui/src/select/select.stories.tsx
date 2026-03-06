import type { Meta, StoryObj } from '@storybook/react';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from './select';

const meta = {
  title: 'Form/Select',
  component: SelectGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof SelectGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <SelectTrigger />
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const WithPlaceholder: Story = {
  args: {
    children: (
      <>
        <SelectTrigger placeholder="Choose a fruit..." />
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'banana',
    children: (
      <>
        <SelectTrigger placeholder="Choose a fruit..." />
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'banana',
    children: (
      <>
        <SelectTrigger placeholder="Choose a fruit..." />
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const ErrorVariant: Story = {
  args: {
    children: (
      <>
        <SelectTrigger
          variant="error"
          placeholder="Choose a fruit..."
        />
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const Sizes: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="label-sm-medium text-foreground mb-2">Small</p>
        <SelectGroup defaultValue="apple">
          <SelectTrigger selectSize="sm" />
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectContent>
        </SelectGroup>
      </div>
      <div>
        <p className="label-sm-medium text-foreground mb-2">Medium (default)</p>
        <SelectGroup defaultValue="banana">
          <SelectTrigger selectSize="md" />
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectContent>
        </SelectGroup>
      </div>
      <div>
        <p className="label-sm-medium text-foreground mb-2">Large</p>
        <SelectGroup defaultValue="cherry">
          <SelectTrigger selectSize="lg" />
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectContent>
        </SelectGroup>
      </div>
    </div>
  ),
};

export const WithGroups: Story = {
  args: {
    children: (
      <>
        <SelectTrigger placeholder="Choose a food..." />
        <SelectContent>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectSeparator />
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
          <SelectItem value="spinach">Spinach</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const FloatingLabel: Story = {
  args: {
    children: (
      <>
        <SelectTrigger floatingLabel="Fruit" />
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </>
    ),
  },
};

export const FloatingLabelWithValue: Story = {
  args: {
    defaultValue: 'banana',
    children: (
      <>
        <SelectTrigger floatingLabel="Fruit" />
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </>
    ),
  },
};
