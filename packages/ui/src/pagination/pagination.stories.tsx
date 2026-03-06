import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    onPageChange: () => {},
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { totalPages: 10, currentPage: 1 },
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        totalPages={10}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const MiddlePage: Story = {
  args: { totalPages: 10, currentPage: 5 },
  render: () => {
    const [page, setPage] = useState(5);
    return (
      <Pagination
        totalPages={10}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const FewPages: Story = {
  args: { totalPages: 3, currentPage: 1 },
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        totalPages={3}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};

export const ManySiblings: Story = {
  args: { totalPages: 20, currentPage: 10, siblingCount: 2 },
  render: () => {
    const [page, setPage] = useState(10);
    return (
      <Pagination
        totalPages={20}
        currentPage={page}
        onPageChange={setPage}
        siblingCount={2}
      />
    );
  },
};
