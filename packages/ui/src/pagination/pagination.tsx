'use client';

import { useMemo } from 'react';
import { cn } from '@sunghoon-log/shared';
import { Text } from '../text';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Pagination range calculation
// ---------------------------------------------------------------------------

const ELLIPSIS = '…' as const;

type PaginationItem = number | typeof ELLIPSIS;

function buildPaginationRange(
  totalPages: number,
  currentPage: number,
  siblingCount: number
): PaginationItem[] {
  // Total visible page numbers: first + last + current + 2*siblings + 2 ellipsis slots
  const totalSlots = siblingCount * 2 + 5;

  // If total pages fit within slots, show all pages
  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    // Show left side pages fully
    const leftCount = siblingCount * 2 + 3;
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...leftRange, ELLIPSIS, totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    // Show right side pages fully
    const rightCount = siblingCount * 2 + 3;
    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => totalPages - rightCount + i + 1
    );
    return [1, ELLIPSIS, ...rightRange];
  }

  // Both ellipsis visible
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, ELLIPSIS, ...middleRange, ELLIPSIS, totalPages];
}

// ---------------------------------------------------------------------------
// Chevron icons
// ---------------------------------------------------------------------------

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={16}
      height={16}
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const range = useMemo(
    () => buildPaginationRange(totalPages, currentPage, siblingCount),
    [totalPages, currentPage, siblingCount]
  );

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav
      aria-label="Pagination"
      className={className}
      data-test-id="pagination"
    >
      <ul className="flex items-center gap-1">
        {/* Prev button */}
        <li>
          <button
            type="button"
            disabled={isFirstPage}
            onClick={() => onPageChange(currentPage - 1)}
            className={cn(
              'flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl',
              'text-muted-foreground transition-all duration-200',
              'hover:bg-muted hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
              isFirstPage && 'cursor-not-allowed opacity-50 hover:bg-transparent'
            )}
            aria-label="Go to previous page"
            data-test-id="pagination-prev"
          >
            <ChevronLeftIcon />
          </button>
        </li>

        {/* Page buttons */}
        {range.map((item, index) => {
          if (item === ELLIPSIS) {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis items have no stable key
              <li key={`ellipsis-${index}`}>
                <span
                  className="flex h-9 w-9 items-center justify-center"
                  data-test-id="pagination-ellipsis"
                >
                  <Text
                    as="span"
                    typography="text-sm-regular"
                    color="muted"
                  >
                    {ELLIPSIS}
                  </Text>
                </span>
              </li>
            );
          }

          const isActive = item === currentPage;

          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                data-test-id={isActive ? 'pagination-page-active' : 'pagination-page'}
              >
                <Text
                  as="span"
                  typography="text-sm-medium"
                  color="inherit"
                >
                  {item}
                </Text>
              </button>
            </li>
          );
        })}

        {/* Next button */}
        <li>
          <button
            type="button"
            disabled={isLastPage}
            onClick={() => onPageChange(currentPage + 1)}
            className={cn(
              'flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl',
              'text-muted-foreground transition-all duration-200',
              'hover:bg-muted hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
              isLastPage && 'cursor-not-allowed opacity-50 hover:bg-transparent'
            )}
            aria-label="Go to next page"
            data-test-id="pagination-next"
          >
            <ChevronRightIcon />
          </button>
        </li>
      </ul>
    </nav>
  );
}
