import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './grid';

const Cell = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gray-100 text-gray-900 px-4 py-6 text-center text-sm font-medium">
    {children}
  </div>
);

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneColumn: Story = {
  args: {
    columns: 1,
    gap: 4,
    children: (
      <>
        <Cell>1</Cell>
        <Cell>2</Cell>
        <Cell>3</Cell>
      </>
    ),
  },
};

export const TwoColumns: Story = {
  args: {
    columns: 2,
    gap: 4,
    children: (
      <>
        <Cell>1</Cell>
        <Cell>2</Cell>
        <Cell>3</Cell>
        <Cell>4</Cell>
      </>
    ),
  },
};

export const ThreeColumns: Story = {
  args: {
    columns: 3,
    gap: 4,
    children: (
      <>
        <Cell>1</Cell>
        <Cell>2</Cell>
        <Cell>3</Cell>
        <Cell>4</Cell>
        <Cell>5</Cell>
        <Cell>6</Cell>
      </>
    ),
  },
};

export const FourColumns: Story = {
  args: {
    columns: 4,
    gap: 4,
    children: (
      <>
        <Cell>1</Cell>
        <Cell>2</Cell>
        <Cell>3</Cell>
        <Cell>4</Cell>
        <Cell>5</Cell>
        <Cell>6</Cell>
        <Cell>7</Cell>
        <Cell>8</Cell>
      </>
    ),
  },
};

export const TwelveColumns: Story = {
  args: {
    columns: 12,
    gap: 2,
    children: (
      <>
        <Cell>1</Cell>
        <Cell>2</Cell>
        <Cell>3</Cell>
        <Cell>4</Cell>
        <Cell>5</Cell>
        <Cell>6</Cell>
        <Cell>7</Cell>
        <Cell>8</Cell>
        <Cell>9</Cell>
        <Cell>10</Cell>
        <Cell>11</Cell>
        <Cell>12</Cell>
      </>
    ),
  },
};
