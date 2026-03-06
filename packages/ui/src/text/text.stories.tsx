import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './text';

const meta = {
  title: 'Typography/Text',
  component: Text,
  tags: ['autodocs'],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Title2xlBold: Story = {
  args: {
    as: 'h1',
    typography: 'title-2xl-bold',
    children: 'Title 2XL Bold',
  },
};

export const TitleXlSemibold: Story = {
  args: {
    as: 'h2',
    typography: 'title-xl-semibold',
    children: 'Title XL Semibold',
  },
};

export const TitleLgSemibold: Story = {
  args: {
    as: 'h3',
    typography: 'title-lg-semibold',
    children: 'Title LG Semibold',
  },
};

export const TextMdRegular: Story = {
  args: {
    typography: 'text-md-regular',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
};

export const TextSmMedium: Story = {
  args: {
    typography: 'text-sm-medium',
    children: 'Secondary info with medium weight.',
  },
};

export const LabelMdMedium: Story = {
  args: {
    as: 'label',
    typography: 'label-md-medium',
    children: 'Label MD Medium',
  },
};

export const WithColor: Story = {
  args: {
    typography: 'text-md-regular',
    color: 'destructive',
    children: 'Destructive colored text',
  },
};

export const WithLineLimit: Story = {
  args: {
    typography: 'text-md-regular',
    lineLimit: 2,
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
};

export const WithAlign: Story = {
  args: {
    typography: 'text-md-regular',
    align: 'center',
    children: 'Center aligned text',
  },
};

export const AllVariants: Story = {
  name: 'Scale Overview',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Text
        as="h1"
        typography="title-2xl-semibold"
      >
        title-2xl-semibold
      </Text>
      <Text
        as="h2"
        typography="title-xl-semibold"
      >
        title-xl-semibold
      </Text>
      <Text
        as="h3"
        typography="title-lg-semibold"
      >
        title-lg-semibold
      </Text>
      <Text
        as="h4"
        typography="title-md-semibold"
      >
        title-md-semibold
      </Text>
      <Text
        as="h5"
        typography="title-sm-semibold"
      >
        title-sm-semibold
      </Text>
      <Text
        as="h6"
        typography="title-xs-semibold"
      >
        title-xs-semibold
      </Text>
      <hr />
      <Text typography="text-lg-regular">text-lg-regular</Text>
      <Text typography="text-md-regular">text-md-regular</Text>
      <Text typography="text-sm-regular">text-sm-regular</Text>
      <Text typography="text-xs-regular">text-xs-regular</Text>
      <hr />
      <Text
        as="label"
        typography="label-lg-medium"
      >
        label-lg-medium
      </Text>
      <Text
        as="label"
        typography="label-md-medium"
      >
        label-md-medium
      </Text>
      <Text
        as="label"
        typography="label-sm-medium"
      >
        label-sm-medium
      </Text>
    </div>
  ),
};

export const ColorVariants: Story = {
  name: 'Color Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Text
        typography="text-md-medium"
        color="foreground"
      >
        foreground
      </Text>
      <Text
        typography="text-md-medium"
        color="muted"
      >
        muted
      </Text>
      <Text
        typography="text-md-medium"
        color="primary"
      >
        primary
      </Text>
      <Text
        typography="text-md-medium"
        color="destructive"
      >
        destructive
      </Text>
      <Text
        typography="text-md-medium"
        color="success"
      >
        success
      </Text>
      <Text
        typography="text-md-medium"
        color="warning"
      >
        warning
      </Text>
      <Text
        typography="text-md-medium"
        color="inherit"
      >
        inherit
      </Text>
    </div>
  ),
};
