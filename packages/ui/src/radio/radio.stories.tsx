import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioItem } from './radio';

const meta = {
  title: 'Form/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <RadioItem
          value="apple"
          label="Apple"
        />
        <RadioItem
          value="banana"
          label="Banana"
        />
        <RadioItem
          value="cherry"
          label="Cherry"
        />
      </>
    ),
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'banana',
    children: (
      <>
        <RadioItem
          value="apple"
          label="Apple"
        />
        <RadioItem
          value="banana"
          label="Banana"
        />
        <RadioItem
          value="cherry"
          label="Cherry"
        />
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    children: (
      <>
        <RadioItem
          value="left"
          label="Left"
        />
        <RadioItem
          value="center"
          label="Center"
        />
        <RadioItem
          value="right"
          label="Right"
        />
      </>
    ),
  },
};

export const WithDescriptions: Story = {
  args: {
    defaultValue: 'standard',
    children: (
      <>
        <RadioItem
          value="standard"
          label="Standard shipping"
          description="Delivered in 5-7 business days"
        />
        <RadioItem
          value="express"
          label="Express shipping"
          description="Delivered in 2-3 business days"
        />
        <RadioItem
          value="overnight"
          label="Overnight shipping"
          description="Delivered next business day"
        />
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
        <RadioItem
          value="apple"
          label="Apple"
        />
        <RadioItem
          value="banana"
          label="Banana"
        />
        <RadioItem
          value="cherry"
          label="Cherry"
        />
      </>
    ),
  },
};

export const DisabledItem: Story = {
  args: {
    defaultValue: 'apple',
    children: (
      <>
        <RadioItem
          value="apple"
          label="Apple"
        />
        <RadioItem
          value="banana"
          label="Banana"
          disabled
        />
        <RadioItem
          value="cherry"
          label="Cherry"
        />
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
        <RadioGroup
          size="sm"
          defaultValue="a"
        >
          <RadioItem
            value="a"
            label="Option A"
          />
          <RadioItem
            value="b"
            label="Option B"
          />
        </RadioGroup>
      </div>
      <div>
        <p className="label-sm-medium text-foreground mb-2">Medium</p>
        <RadioGroup
          size="md"
          defaultValue="a"
        >
          <RadioItem
            value="a"
            label="Option A"
          />
          <RadioItem
            value="b"
            label="Option B"
          />
        </RadioGroup>
      </div>
      <div>
        <p className="label-sm-medium text-foreground mb-2">Large</p>
        <RadioGroup
          size="lg"
          defaultValue="a"
        >
          <RadioItem
            value="a"
            label="Option A"
          />
          <RadioItem
            value="b"
            label="Option B"
          />
        </RadioGroup>
      </div>
    </div>
  ),
};
